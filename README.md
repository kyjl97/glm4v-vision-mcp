# GLM-4V Flash MCP Server

基于智谱 AI GLM-4V Flash 模型的图片识别 MCP (Model Context Protocol) 服务器。

## ✨ 功能

- **图片分析** (`analyze_image`) - 使用自然语言分析图片内容
- **文字提取** (`extract_text`) - OCR 功能，支持中英文
- **图片描述** (`describe_image`) - 生成图片描述，支持多种风格

## 📦 安装

### 前置要求

- Node.js 18+
- 智谱 AI API Key ([点此获取 API key](https://www.bigmodel.cn/invite?icode=JlEjx6TPw0ed2vIHdwLJXGczbXFgPRGIalpycrEwJ28%3D))

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/GLM-4V-Flash-MCP/glm-4v-flash-mcp.git
cd glm-4v-flash-mcp

# 2. 安装依赖
npm install

# 3. 设置 API Key
export ZHIPU_API_KEY="your-api-key-here"

# 4. 运行服务器
npm start
```

## 🔧 配置

### 集成到 Claude Code

在 `~/.claude/settings.json` 中添加：

```json
{
  "mcpServers": {
    "glm-4v-flash": {
      "command": "node",
      "args": ["/path/to/server.js"],
      "env": {
        "ZHIPU_API_KEY": "${ZHIPU_API_KEY}"
      },
      "workingDirectory": "/path/to"
    }
  }
}
```

### 集成到 VS Code

在 `.vscode/settings.json` 中添加：

```json
{
  "mcpServers": {
    "glm-4v-flash": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "ZHIPU_API_KEY": "${env:ZHIPU_API_KEY}"
      }
    }
  }
}
```

### 集成到其他 MCP 客户端

在 `.mcp/mcp.json` 中配置（已包含在项目中）：

```json
{
  "mcpServers": {
    "glm-4v-flash": {
      "command": "node",
      "args": ["server.js"],
      "env": {
        "ZHIPU_API_KEY": "${ZHIPU_API_KEY}"
      },
      "cwd": "${ZHIPU_MCP_DIR}"
    }
  }
}
```

使用前设置环境变量：

```bash
export ZHIPU_API_KEY="your-api-key-here"
export ZHIPU_MCP_DIR="/path/to/glm-4v-flash-mcp"
```

## 🛠️ 工具说明

### analyze_image

分析图片内容，支持自定义提示词。

**参数：**
- `image_path` (必填): 图片文件路径
- `prompt` (可选): 分析提示词

**示例：**
```json
{
  "name": "analyze_image",
  "arguments": {
    "image_path": "/path/to/image.jpg",
    "prompt": "描述图片中的场景和人物"
  }
}
```

### extract_text

从图片中提取文字（OCR）。

**参数：**
- `image_path` (必填): 图片文件路径
- `language` (可选): 文字语言，可选 `chinese`、`english`、`auto`

**示例：**
```json
{
  "name": "extract_text",
  "arguments": {
    "image_path": "/path/to/image.png",
    "language": "chinese"
  }
}
```

### describe_image

生成图片的详细描述。

**参数：**
- `image_path` (必填): 图片文件路径
- `style` (可选): 描述风格，可选 `detailed`、`concise`、`poetic`、`technical`

**示例：**
```json
{
  "name": "describe_image",
  "arguments": {
    "image_path": "/path/to/image.jpg",
    "style": "detailed"
  }
}
```

## 📋 支持的图片格式

- PNG
- JPG / JPEG
- WebP
- GIF
- BMP

## 🔒 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `ZHIPU_API_KEY` | 智谱 AI API Key | 是 |

## 🚀 开发

```bash
# 安装依赖
npm install

# 开发模式（自动重载）
npm run dev

# 运行测试
npm test
```

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [智谱 AI 开放平台](https://open.bigmodel.cn/)
- [GLM-4V 模型文档](https://open.bigmodel.cn/dev/api/normal-model/glm-4v)
- [MCP 协议规范](https://modelcontextprotocol.io/)

---

## 关于作者

**得救之道** — 科技博主，也是一名github开源作者，非科班出身，以实践驱动开发，践行Build in Public成长理念，深耕 Windows效率生态，擅长将AI Agent从构想转化为可落地的实用方案，我坚信AI与智能体将重塑个人做事方式，愿以自身技术积累，助力个体把握智能时代机遇，高效提升自身创作、办公与成长效率。

| 平台         | 链接                                                                                                                                             |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 🌐 官网      | [kyjl97.github.io](https://kyjl97.github.io/)  [ai.kyjl97.github.io](https://kyjl97.github.io/deepseek-imagegen/)  [os.kyjl97.github.io](https://kyjl97.github.io/oszen/)                                                                          |
| 𝕏 Twitter | [@kyjl97](https://github.com/kyjl97)                                                                                                           |
| 📺 B站      | [得救之道_](https://jieliu.me)                                                                                     |
| ▶️ YouTube | [@kyjl97](https://github.com/kyjl97)                                                                                         |
| 💬 公众号     | 微信搜「得救之道」或扫码关注 ↓                                                                                                                               |

![得救之道](https://raw.githubusercontent.com/kyjl97/kyjl97/main/assets/wechat-qr.png)
