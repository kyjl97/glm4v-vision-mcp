---
name: glm-4v-vision
description: 使用 GLM-4V Flash 模型进行图片识别、文字提取和图像描述。支持中文和英文，适用于图片分析、OCR、内容理解等场景。
---

# GLM-4V Flash 图片识别 Skill

使用智谱 AI 的 GLM-4V Flash 模型进行图片内容识别。

## 前置条件

确保已设置环境变量 `ZHIPU_API_KEY`（智谱 AI API Key）。

## 可用工具

### 1. analyze_image - 图片分析

分析图片内容，支持自定义提示词。

**参数：**
- `image_path` (必填): 图片文件路径
- `prompt` (可选): 分析提示词，默认 "请详细描述这张图片的内容"

**示例：**
```
分析图片内容：D:\images\photo.jpg，提示词：描述图片中的场景和人物
```

### 2. extract_text - 文字提取 (OCR)

从图片中提取文字内容。

**参数：**
- `image_path` (必填): 图片文件路径
- `language` (可选): 文字语言，可选 `chinese`、`english`、`auto`，默认 `auto`

**示例：**
```
提取图片文字：D:\images\doc.png，语言：chinese
```

### 3. describe_image - 图片描述

生成图片的详细描述，支持多种风格。

**参数：**
- `image_path` (必填): 图片文件路径
- `style` (可选): 描述风格，可选 `detailed`、`concise`、`poetic`、`technical`，默认 `detailed`

**示例：**
```
描述图片：D:\images\art.jpg，风格：detailed
```

## 使用流程

1. 用户指定图片路径和分析需求
2. 调用对应的 MCP 工具（analyze_image / extract_text / describe_image）
3. 返回 GLM-4V Flash 的分析结果

## 支持的图片格式

- PNG
- JPG / JPEG
- WebP
- GIF
- BMP

## 注意事项

- 图片会自动压缩至最大边长 2048 像素，以优化传输速度
- 需要有效的智谱 AI API Key
- 支持中文和英文提示词
