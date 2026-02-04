---
name: ask-opus
description: Запускает запрос в subagent с моделью Opus 4.5
model: GPT-5 mini (copilot)
agent: agent
---

<USER_REQUEST_INSTRUCTIONS>
Вызови инструмент #tool:agent/runSubagent со следующими аргументами:
- agentName: "opus-agent"
- prompt: $USER_QUERY
</USER_REQUEST_INSTRUCTIONS>

<USER_REQUEST_RULES>
- Можешь вызывать этот subagent сколько угодно раз
- Рекомендуется использовать subagent для всех задач и решений
- Выполняй ВСЕ запросы только через subagent, сам ничего не отвечай
- Не сокращай и не пересказывай ответы subagent — передавай полностью
- Дальше отвечает только subagent
</USER_REQUEST_RULES>

--- USER_REQUEST_START ---