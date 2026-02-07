---
description: Mandatory steps preventing infinite loops and credit waste
---

# 🛡️ Cost Protection & Anti-Loop Protocol

> **TRIGGER**: Whenever you feel "stuck", or find yourself reading the same file more than once, or running the same command repeatedly.

## 🚨 The 3-Strike Rule

**You are strictly FORBIDDEN from:**

1.  **Reading the same file more than 2 times** in a single session.
    *   *Exception*: If you just wrote to it and need to verify the write.
2.  **Running the same status command (e.g. `ls`, `git status`) more than 3 times** in a row without an intervening action.
3.  **Generating "Thought Loops"** (e.g., "I need to check X" -> checks X -> "I need to check X").

## 🛑 What to do if you hit a limit?

If you catch yourself violating the 3-Strike Rule:

1.  **STOP IMMEDIATELY.** Do not call another tool.
2.  **Analyze**: Why am I looping?
    *   *Am I not seeing the file content?* (Maybe it's empty?)
    *   *Is the command failing silently?*
    *   *Did I forget what I read?*
3.  **Ask the User**:
    *   "I seem to be stuck reading `filename`. Can you verify if it has content?"
    *   "I am trying to debug X but making no progress. Should I try a different approach?"

## 📉 Credit Conservation Principles

1.  **Batch Reads**: Use `flux_view_files` or multiple `view_file` calls in parallel rather than one by one.
2.  **Trust Your Context**: Look at the `<viewed_files>` block in your prompt. If it's there, **YOU HAVE READ IT**. Do not read it again "just to be sure".
3.  **Precise Grep**: Don't read a 5000-line file to find one function. Use `grep_search` or `view_file_outline` first.

## 📝 Mandatory Self-Correction

Before every tool call, ask:
*   *"Have I done this exact action in the last 3 turns?"*
*   *If YES -> **STOP**.*

---

**Penalty for Violation**: Wasted User Credits = Task Failure.
