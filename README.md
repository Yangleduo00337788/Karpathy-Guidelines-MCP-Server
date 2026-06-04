# Karpathy Guidelines MCP Server

将 Andrej Karpathy 的编码指南封装为 MCP 工具，供 Claude Code 直接调用。

## 安装

```bash
cd mcp-server
npm install
```

## 配置

在 Claude Code 的 MCP 配置文件中添加（`~/.claude/settings.json` 或项目级 `.claude/settings.json`）：

```json
{
  "mcpServers": {
    "karpathy-guidelines": {
      "command": "node",
      "args": ["D:/yangleduo/SoftWare/GoogleChrome/andrej-karpathy-skills-main/andrej-karpathy-skills-main/mcp-server/index.js"]
    }
  }
}
```

> 将 `args` 中的路径替换为你实际的项目路径。

## 提供的工具

### `get_guidelines`

返回完整的 Karpathy 编码指南。在编写或审查代码前调用，加载行为准则。

**参数：** 无

### `review_code`

根据四大原则审查代码，给出改进建议。

**参数：**
- `code`（必填）— 待审查的代码片段
- `context`（可选）— 代码的用途说明

**检查内容：**
1. **Think Before Coding** — 是否提供了足够的上下文和假设说明
2. **Simplicity First** — 代码行数是否过多，是否有过度抽象
3. **Surgical Changes** — 是否有超出请求范围的改动
4. **Goal-Driven Execution** — 是否有测试来验证代码

## 使用示例

在 Claude Code 中，你可以直接说：

- "用 karpathy guidelines 审查一下这段代码"
- "先加载 karpathy 指南，然后帮我写代码"
