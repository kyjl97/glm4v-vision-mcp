#!/bin/bash
# GLM-4V Flash MCP 启动脚本
# 用法: ./start-mcp.sh

set -e

# 检查 API Key
if [ -z "$ZHIPU_API_KEY" ]; then
  echo "错误: 请先设置环境变量 ZHIPU_API_KEY"
  echo "export ZHIPU_API_KEY='your-api-key'"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "启动 GLM-4V Flash MCP 服务器..."
node server.js
