@echo off
REM GLM-4V Flash MCP 启动脚本 (Windows)
REM 用法: start-mcp.bat

if "%ZHIPU_API_KEY%"=="" (
  echo 错误: 请先设置环境变量 ZHIPU_API_KEY
  echo set ZHIPU_API_KEY=your-api-key
  exit /b 1
)

echo 启动 GLM-4V Flash MCP 服务器...
node server.js
