import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  dangerouslyAllowBrowser: true
});

type RequestData = {
  content: string,
  messages: [{role: string, content: string}]
}

export const runtime = 'edge'

export async function POST(request: Request) {
  const {content, messages} = (await request.json()) as RequestData

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [...messages, {role: 'user', content}],
  })

  const data = completion.choices[0].message.content ?? ''

  return Response.json(data)
}
