#!/usr/bin/env node
/**
 * GLM-4V Flash 图片识别 MCP 服务器
 * 使用智谱 AI 的 GLM-4V Flash 模型进行图片内容识别
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import sharp from "sharp";
import { existsSync } from "fs";
import { resolve } from "path";

// 配置
const API_KEY = process.env.ZHIPU_API_KEY || "";
const API_URL = "https://open.bigmodel.cn/api/paas/v4";
const MODEL = "glm-4v-flash";

if (!API_KEY) {
  console.error("错误: 请设置环境变量 ZHIPU_API_KEY");
  process.exit(1);
}

/**
 * 定义 MCP 工具
 */
const TOOLS = [
  {
    name: "analyze_image",
    description: "使用 GLM-4V Flash 分析图片内容，支持中文和英文描述",
    inputSchema: {
      type: "object",
      properties: {
        image_path: {
          type: "string",
          description: "图片文件路径（支持 png, jpg, jpeg, webp, gif 格式）",
        },
        prompt: {
          type: "string",
          description: "分析提示词，例如：描述图片内容、识别文字、分析场景等",
          default: "请详细描述这张图片的内容",
        },
      },
      required: ["image_path"],
    },
  },
  {
    name: "extract_text",
    description: "从图片中提取文字（OCR 功能）",
    inputSchema: {
      type: "object",
      properties: {
        image_path: {
          type: "string",
          description: "图片文件路径",
        },
        language: {
          type: "string",
          description: "文字语言",
          enum: ["chinese", "english", "auto"],
          default: "auto",
        },
      },
      required: ["image_path"],
    },
  },
  {
    name: "describe_image",
    description: "生成图片的详细描述，用于图像标注或 Accessibility",
    inputSchema: {
      type: "object",
      properties: {
        image_path: {
          type: "string",
          description: "图片文件路径",
        },
        style: {
          type: "string",
          description: "描述风格",
          enum: ["detailed", "concise", "poetic", "technical"],
          default: "detailed",
        },
      },
      required: ["image_path"],
    },
  },
];

/**
 * 将图片转换为 Base64
 */
async function imageToBase64(imagePath) {
  const ext = imagePath.split(".").pop()?.toLowerCase() || "png";
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    bmp: "image/bmp",
  };

  const mimeType = mimeTypes[ext] || "image/png";

  try {
    // 使用 sharp 压缩大图片（限制最大边长为 2048）
    const metadata = await sharp(imagePath).metadata();
    const maxDimension = 2048;

    let pipeline = sharp(imagePath);

    if (metadata.width && metadata.width > maxDimension) {
      pipeline = pipeline.resize(maxDimension, null, { fit: "inside" });
    }
    if (metadata.height && metadata.height > maxDimension) {
      pipeline = pipeline.resize(null, maxDimension, { fit: "inside" });
    }

    const { data, info } = await pipeline
      .toBuffer({ resolveWithObject: true });

    const base64 = data.toString("base64");
    return { data: base64, mimeType };
  } catch (error) {
    throw new Error(`无法读取图片: ${error.message}`);
  }
}

/**
 * 调用 GLM-4V Flash API
 */
async function callGLM4V(
  imageUrl,
  prompt,
  mimeType
) {
  const response = await fetch(`${API_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageUrl}`,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`API 错误: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 处理工具调用
 */
async function handleToolCall(name, args) {
  const { image_path } = args;

  // 验证文件存在
  const fullPath = resolve(image_path);
  if (!existsSync(fullPath)) {
    return `错误: 文件不存在 ${fullPath}`;
  }

  // 转换为 Base64
  const { data: base64, mimeType } = await imageToBase64(fullPath);

  // 根据工具名称调用不同的提示词
  let prompt = "";
  switch (name) {
    case "analyze_image":
      prompt = args.prompt || "请详细描述这张图片的内容";
      break;
    case "extract_text":
      const lang = args.language || "auto";
      prompt = lang === "chinese"
        ? "请提取图片中的所有文字，保持原有格式"
        : lang === "english"
        ? "Extract all text from the image exactly as it appears"
        : "请提取图片中的所有文字";
      break;
    case "describe_image":
      const style = args.style || "detailed";
      const stylePrompts = {
        detailed: "请对这张图片进行详细、全面的描述，包括所有可见元素、颜色、构图、氛围等",
        concise: "用简洁的语言描述这张图片的主要内容",
        poetic: "用富有诗意的语言描述这张图片",
        technical: "从技术角度描述这张图片，包括光线、构图、色彩等专业术语",
      };
      prompt = stylePrompts[style] || stylePrompts.detailed;
      break;
    default:
      prompt = "请描述这张图片";
  }

  // 调用 API
  const result = await callGLM4V(base64, prompt, mimeType);
  return result;
}

/**
 * 主函数
 */
async function main() {
  const server = new Server(
    {
      name: "glm-4v-flash-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // 注册工具列表
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  // 注册工具调用
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    try {
      const result = await handleToolCall(request.params.name, request.params.arguments || {});
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `错误: ${error.message}`,
          },
        ],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("GLM-4V Flash MCP 服务器已启动");
}

main().catch(console.error);
