<div align="center">

# Karpathy Guidelines MCP Server

</div>


[![npm version](https://img.shields.io/npm/v/karpathy-guidelines-mcp.svg)](https://www.npmjs.com/package/karpathy-guidelines-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



> 基于 [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876) 对 LLM 编码陷阱的观察，将编码行为准则封装为 MCP 工具，供 Claude Code 直接调用。

## 目录

- [简介](#简介)
- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [使用指南](#使用指南)
- [API 文档](#api-文档)
- [四大原则](#四大原则)
- [项目结构](#项目结构)
- [贡献指南](#贡献指南)
- [开源协议](#开源协议)

## 简介

LLM 编码时常见的问题：代你做错误假设、过度复杂化代码、改动不该碰的代码、缺乏可验证的成功标准。

本项目将 Andrej Karpathy 提出的四大编码原则封装为 MCP（Model Context Protocol）服务器，提供两个工具：

- **`get_guidelines`** — 加载完整的编码行为准则
- **`review_code`** — 根据四大原则审查代码并给出改进建议

## 功能特性

- 🔍 **代码审查** — 自动检测过度工程、缺失测试、超出范围的改动等问题
- 📖 **指南加载** — 一键获取完整的 Karpathy 编码准则
- 🔌 **即插即用** — 标准 MCP 协议，兼容所有支持 MCP 的客户端
- 📦 **npx 直接运行** — 无需手动下载，`npx` 一行命令搞定

## 快速开始

### 前置条件

- [Node.js](https://nodejs.org/) >= 18
- [Claude Code](https://claude.ai/code) 或其他 MCP 客户端

### 安装配置

在 Claude Code 的 MCP 配置文件中添加：

**全局配置**（`~/.claude/settings.json`）：

```json
{
  "mcpServers": {
    "karpathy-guidelines": {
      "command": "npx",
      "args": ["-y", "karpathy-guidelines-mcp"]
    }
  }
}
```

**项目级配置**（`.claude/settings.json`）：

```json
{
  "mcpServers": {
    "karpathy-guidelines": {
      "command": "npx",
      "args": ["-y", "karpathy-guidelines-mcp"]
    }
  }
}
```

配置完成后重启 Claude Code 即可使用。

## 使用指南

### 加载编码指南

在编写代码前，让 Claude 加载行为准则：

```
帮我加载 karpathy 编码指南
```

### 审查代码

将代码交给 Claude 审查：

```
用 karpathy guidelines 审查一下这段代码：

function createUser(data) {
  const validator = new UserValidator();
  const transformer = new DataTransformer();
  const repository = new UserRepository();
  const result = validator.validate(data);
  if (result.isValid) {
    const transformed = transformer.transform(data);
    return repository.save(transformed);
  }
  throw new ValidationError(result.errors);
}
```

### 本地开发运行

```bash
git clone https://github.com/Yangleduo00337788/Karpathy-Guidelines-MCP-Server.git
cd Karpathy-Guidelines-MCP-Server/mcp-server
npm install
node index.js
```

## API 文档

### `get_guidelines`

返回完整的 Karpathy 编码指南。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| 无 | - | - | - |

**返回值：** 完整的编码指南文本

---

### `review_code`

根据四大原则审查代码，返回结构化的审查意见。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `code` | `string` | ✅ | 待审查的代码片段 |
| `context` | `string` | ❌ | 代码的用途说明（不提供会提示补充） |

**返回值：** 审查意见列表，包含问题描述和改进建议

**检查规则：**

| 原则 | 检查内容 |
|------|---------|
| Think Before Coding | 是否提供了足够的上下文和假设说明 |
| Simplicity First | 代码行数是否过多，是否有过度抽象 |
| Surgical Changes | 是否有超出请求范围的改动 |
| Goal-Driven Execution | 是否有测试来验证代码 |

## 四大原则

| 原则 | 核心理念 | 解决的问题 |
|------|---------|-----------|
| **编码前思考** | 不要假设，不要隐藏困惑 | 错误假设、缺少权衡 |
| **简洁优先** | 用最少的代码解决问题 | 过度工程、臃肿抽象 |
| **精准修改** | 只碰必须碰的 | 无关编辑、改动不该碰的代码 |
| **目标驱动执行** | 定义成功标准，循环验证 | 模糊的成功标准、缺乏测试 |

## 项目结构

```
Karpathy-Guidelines-MCP-Server/
├── mcp-server/
│   ├── index.js           # MCP 服务器主文件
│   ├── package.json       # 依赖配置
│   └── README.md          # 本文件
├── skills/
│   └── karpathy-guidelines/
│       └── SKILL.md       # 原始技能定义
├── CLAUDE.md              # Claude Code 指南
└── README.md              # 项目说明
```

## 贡献指南

欢迎提交 Issue 和 Pull Request。

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'feat: add some feature'`
4. 推送分支：`git push origin feature/your-feature`
5. 提交 Pull Request

### Commit 规范

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` Bug 修复
- `docs:` 文档更新
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建/工具相关

## 开源协议

[MIT License](./LICENSE)

---

> 如果这个项目对你有帮助，欢迎 ⭐ Star 支持！
