# AI Factory Guardrails

## Project Conventions

- Follow existing code style and patterns in the project
- Use conventional commits format for all commit messages
- Always check for existing implementations before creating new ones
- Prefer editing existing files over creating new ones
- Run tests after making changes when test infrastructure exists

## Skill Usage

- Use `/ai-factory.feature` for new features — creates branch, plan, and tasks
- Use `/ai-factory.fix` for bug fixes — analyzes, fixes, suggests tests
- Use `/ai-factory.commit` for commits — follows conventional commits
- Use `/ai-factory.implement` to execute plans step by step
- Use `/ai-factory.review` before merging — checks code quality

## Safety

- Never commit secrets, tokens, or credentials
- Never force-push to main/master branches
- Always create feature branches for new work
