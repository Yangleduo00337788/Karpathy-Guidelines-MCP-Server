#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const GUIDELINES = `# Karpathy Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from Andrej Karpathy's observations on LLM coding pitfalls.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.`;

const server = new McpServer({
  name: "karpathy-guidelines",
  version: "1.0.0",
});

// Tool 1: Get guidelines
server.tool(
  "get_guidelines",
  "Returns the full Karpathy coding guidelines. Call this before writing or reviewing code to load the behavioral rules.",
  {},
  async () => ({
    content: [{ type: "text", text: GUIDELINES }],
  })
);

// Tool 2: Review code
server.tool(
  "review_code",
  "Review code against the 4 Karpathy principles: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution.",
  {
    code: z.string().describe("The code snippet to review"),
    context: z
      .string()
      .optional()
      .describe("Optional context about what the code is supposed to do"),
  },
  async ({ code, context }) => {
    const issues = [];

    // Principle 1: Think Before Coding
    if (!context || context.trim() === "") {
      issues.push(
        "[Think Before Coding] No context provided. What is this code supposed to do? Are there assumptions that need to be stated?"
      );
    }

    // Principle 2: Simplicity First
    const lines = code.split("\n").filter((l) => l.trim() !== "");
    if (lines.length > 50) {
      issues.push(
        `[Simplicity First] Code is ${lines.length} lines. Ask yourself: could this be significantly shorter? A senior engineer might say this is overcomplicated.`
      );
    }

    // Check for common over-engineering patterns
    if (
      code.includes("abstract class") &&
      code.includes("extends") &&
      !code.includes("// needed because")
    ) {
      issues.push(
        "[Simplicity First] Abstract class detected. Is this abstraction justified by multiple concrete uses, or is it speculative?"
      );
    }

    const interfaceCount = (code.match(/interface\s+\w+/g) || []).length;
    if (interfaceCount > 3) {
      issues.push(
        `[Simplicity First] Found ${interfaceCount} interfaces. Are all of these necessary, or is this over-abstracted?`
      );
    }

    // Principle 3: Surgical Changes
    const hasUnrelatedFormatting =
      code.includes("// improved") ||
      code.includes("// cleaned up") ||
      code.includes("// refactored");
    if (hasUnrelatedFormatting) {
      issues.push(
        "[Surgical Changes] Comments like 'improved/cleaned up/refactored' suggest changes beyond what was asked. Every changed line should trace to the user's request."
      );
    }

    // Principle 4: Goal-Driven Execution
    const hasTests =
      code.includes("test(") ||
      code.includes("describe(") ||
      code.includes("it(") ||
      code.includes("assert") ||
      code.includes("expect(");
    const hasTestableLogic =
      code.includes("function ") ||
      code.includes("const ") ||
      code.includes("class ");
    if (hasTestableLogic && !hasTests) {
      issues.push(
        "[Goal-Driven Execution] Code has logic but no tests. How will you verify this works? Define success criteria."
      );
    }

    if (issues.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: "✅ No obvious issues found against the 4 Karpathy principles. The code looks clean and appropriately scoped.",
          },
        ],
      };
    }

    const review = issues
      .map((issue, i) => `${i + 1}. ${issue}`)
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `## Code Review — Karpathy Guidelines\n\nFound ${issues.length} potential issue(s):\n\n${review}`,
        },
      ],
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
