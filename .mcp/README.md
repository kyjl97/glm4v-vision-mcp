# MCP 配置

此目录包含 MCP (Model Context Protocol) 服务器的配置文件。

## 使用方法

1. 设置环境变量 `ZHIPU_API_KEY`
2. 设置环境变量 `ZHIPU_MCP_DIR` 为本项目路径
3. 在支持的 MCP 客户端中配置

## 配置说明

- `command`: 运行 MCP 服务器的命令
- `args`: 传递给命令的参数
- `env`: 环境变量
- `cwd`: 工作目录（用于解析相对路径）

## 示例

```bash
# 设置环境变量
export ZHIPU_API_KEY="your-zhipu-api-key"
export ZHIPU_MCP_DIR="/path/to/glm-4v-flash-mcp"
```

## 其他客户端

- **Claude Desktop**: 参见根目录 `README.md`
- **VS Code**: 参见根目录 `README.md`
- **Cursor**: 参见根目录 `README.md`
