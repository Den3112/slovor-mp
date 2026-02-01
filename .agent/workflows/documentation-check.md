---
description: Workflow for checking external documentation using Context7/MCP.
---

# DOCUMENTATION CHECK PROTOCOL

**Goal**: Never assume API knowledge. Verify validity via external documentation.

## Step 1: Identify Technology

- What framework, library, or API is being used? (e.g., Next.js 14, Stripe API, Supabase).
- **Rule**: If the training data cut-off might be an issue, functionality _must_ be verified.

## Step 2: Query Context7

- Use `search_web` or a specific MCP tool to find the _official_ documentation.
- **Do not rely on blogs**. Look for `docs.project.com`.

## Step 3: Verify Patterns

- Read the "Getting Started" or "Migration Guide".
- **Check**: Are there breaking changes?
- **Check**: Is the pattern deprecated?

## Step 4: Update Directives

- If a new pattern is found, update `.agent/MEMORY.md` under `📚 Knowledge Base`.
- Example: "Next.js 13+ requires `app/` directory structure. Do not use `pages/`."
