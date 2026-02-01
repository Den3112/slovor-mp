---
description: Protocol for maintaining Project Memory and Context to ensure continuity across sessions.
---

# 🧠 Project Memory & Context Protocol

This protocol ensures that every agent arriving at the project immediately understands the current state, recent progress, and next steps without requiring user explanation.

## 1. The Single Source of Truth: `.agent/MEMORY.md`

All high-level project context must be stored in `.agent/MEMORY.md`. This file is the "brain" of the project.

### Structure of `MEMORY.md`:

1.  **Project Status**: High-level summary (e.g., "Active Development", "Maintenance", "Major Refactor").
2.  **Current Focus**: The *single* most important high-level goal right now.
3.  **Active Tasks/Roadmap**: "ToDo" list of immediate next steps.
4.  **Recent Achievements**: List of completed milestones.
5.  **Technical Context**: Key architectural decisions, libraries, and constraints (e.g., "Use Tailwind", "Russian Language", "Supabase").
6.  **Handover Notes**: Specific instructions or warnings for the next agent.

## 2. Agent Responsibilities

### 🟢 AT THE START of Every Session:
1.  **READ `.agent/MEMORY.md`**: This is your absolute first priority.
2.  **Load RAM**: specific attention to "⚡ Active RAM" — this is your immediate context.
3.  **Check Knowledge Base**: Look at "📚 Knowledge Base" to avoid repeating past mistakes.

### 🟡 DURING the Session (Live RAM Updates):
**You MUST update `.agent/MEMORY.md` in real-time when:**
1.  **Context Shifts**: You discover the problem is different than expected.
2.  **Blocker Found**: You hit a compile error or bug that will take multiple attempts to fix. *Write it down in "Active Errors" immediately.*
3.  **Hypothesis Formed**: Before starting a complex refactor, write your plan in "Scratchpad".
4.  **Lesson Learned**: If you fix a tricky bug, **immediately** add it to "📚 Knowledge Base".

### 🔴 AT THE END of Every Session:
1.  **VERIFY**: Run `npm run verify`. If it fails, **FIX IT**. Do not leave broken code.
2.  **Commit Memory**:
    - Clear "⚡ Active RAM" (or leave it if the task is unfinished).
    - Ensure "Active Tasks" reflect reality.
    - **CRITICAL**: Did you learn something new? Write it in "Knowledge Base".

## 3. Formatting Rules

- Keep it concise. Bullet points are best.
- Use emojis to make it scannable.
- **Do not** delete important context unless it is obsolete.
- **Do not** let the file become a dump. Summarize when necessary.
