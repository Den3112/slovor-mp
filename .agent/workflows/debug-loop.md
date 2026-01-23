---
description: Systematic process for debugging errors and system recovery.
---

# DEBUG LOOP PROTOCOL

**Trigger**: CI/CD Failure, Runtime Exception, or Test Regression.

## Step 1: SEARCH (Evidence Gathering)

- **Logs**: Retrieve full stack traces. Do not truncate.
- **Location**: Identify the exact file, line number, and component.
- **Context**: Analyze surrounding code changes and recent commits.

## Step 2: ISOLATE (Hypothesis Testing)

- **The Hypothesis**: Formulate "X causes Y because Z".
- **Reproduction**: Create a minimal reproduction script or test case.
- **Sanity Check**: Verify environment consistency (Node version, dependency tree).

## Step 3: FIX (Surgical Intervention)

- **Root Cause**: Fix the underlying issue, not the symptom.
- **Minimalism**: Apply the smallest effective change. Avoid "shotgun debugging".

## Step 4: VERIFY (Validation)

- **Regression Test**: Ensure the fix does not break existing functionality.
- **Reproduction Test**: Confirm the reproduction case now passes.
- **Lint/Build**: Verify system integrity.

## Step 5: PREVENT (Future Proofing)

- **Test Coverage**: Add a regression test for this specific scenario.
- **Documentation**: record the finding in `memory/lessons.md`.
