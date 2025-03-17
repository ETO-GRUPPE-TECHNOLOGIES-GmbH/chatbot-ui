import OpenAI from "openai"

export function removeUsedURLs(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
  console.log("messages before", messages)
  return messages.map(message => {
    if (typeof message.content === "string") {
      const pattern = "Used URLs:\n\n"
      const index = message.content.indexOf(pattern)
      if (index !== -1) {
        console.log(
          "message after(removed urls): ",
          message.content.substring(0, index).trimEnd()
        )
        return {
          ...message,
          content: message.content.substring(0, index).trimEnd()
        }
      }
    }
    return message
  })
}
