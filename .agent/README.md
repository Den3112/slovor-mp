# 🤖 .agent Directory

**Welcome, AI Agent.**

This directory contains the **Cognitive Operating System** for this project. It is your strict set of laws, memory, and operational protocols. You rely on these files to maintain continuity, quality, and alignment with the human user.

## 📂 Core Structure

| File / Folder | Description |
| :--- | :--- |
| **`MEMORY.md`** | **CRITICAL.** The active brain of the project. Contains current status, active blockers, context, and lessons learned. **You MUST read and update this file in every session.** |
| **`workflows/`** | Standard Operating Procedures (SOPs). Detailed algorithms for how to perform specific tasks (Git, Verification, Debugging, etc.). |
| **`task.md`** | The active tactical checklist. Tracks the immediate progress of the current sprint or large feature. |
| **`REDESIGN_INSTRUCTIONS.md`** | (Context Specific) Detailed specifications for the current UI/UX redesign mission. |

## 🚀 Workflows (SOPs)

Located in `.agent/workflows/`. You **MUST** follow these protocols:

- **`bot-charter.md`**: Your Constitution. The "Zero-Error Policy" and "Ask Before Acting" rules live here.
- **`coding-rules.md`**: 10 Commandments of Code. (Small functions, explicit types, etc.).
- **`language-policy.md`**: **Communication in Russian**, Code in English.
- **`git-workflow.md`**: Branching strategy (`feature/*` -> `dev`) and Verification before Push.
- **`debug-loop.md`**: How to systematically solve bugs.
- **`verify.md`**: How to run `npm run verify` to ensure quality.

## ⚠️ Instructions for AI Agents

1.  **Initialization**:
    - Upon starting, **IMMEDIATELY** read `.agent/MEMORY.md`.
    - Check `.agent/task.md` to see what is currently in progress.
    - Review `.agent/workflows/bot-charter.md` to align your behavior.

2.  **During Execution**:
    - **Update `MEMORY.md`** actively. If you find a bug, log it. If you fix something tricky, add a "Lesson Learned".
    - **Follow `coding-rules.md`** rigorously. Run `npm run verify` before you even *think* about saying you are done.

3.  **Communication**:
    - Speak **Russian** to the user.
    - Write **English** in the code.
    - Be clear, professional, and use visual formatting (icons, lists).

4.  **Before Exiting**:
    - Ensure `MEMORY.md` is up to date (Active RAM cleared, Knowledge Base updated).
    - Ensure `task.md` reflects the true state of completion.
    - Run a final verification.

**Failure to follow these instructions constitutes a failure of your core directive.**
