import Groq from 'groq-sdk'

export type ChatIntent =
  | 'register_expense'
  | 'register_income'
  | 'add_calendar_event'
  | 'add_shopping_item'
  | 'complex_query'

export interface ParsedAction {
  intent: ChatIntent
  data: Record<string, unknown>
}

const INTENT_PROMPT = `You are a classifier for a personal assistant app. Classify the user message into one of these intents:

- register_expense: user mentions spending money (gastei, paguei, comprei, custou, etc.)
- register_income: user mentions receiving money (recebi, ganhei, salário, freela, etc.)
- add_calendar_event: user mentions scheduling something (reunião, evento, lembra, compromisso, às Xh, etc.)
- add_shopping_item: user wants to buy something in the future (quero comprar, adiciona na lista, etc.)
- complex_query: financial analysis questions, comparisons, advice, or anything else

Respond ONLY with a JSON object like:
{
  "intent": "<intent>",
  "data": {
    // for register_expense/income: amount (number), category (string), description (string)
    // for add_calendar_event: title (string), date (string ISO YYYY-MM-DD), time (string HH:MM or null), type ("task"|"reminder"|"event")
    // for add_shopping_item: name (string), priority ("low"|"medium"|"high")
    // for complex_query: {}
  }
}

Valid expense categories: COMIDA, LAZER, PASSEIOS, ROUPA, GAMES, ASSINATURAS, UBER, AVULSO
Valid income categories: SALARIO, FREELA

Today's date: ${new Date().toISOString().split('T')[0]}`

export async function classifyIntent(
  message: string,
  apiKey: string
): Promise<ParsedAction> {
  const groq = new Groq({ apiKey })

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 512,
    temperature: 0,
    messages: [
      { role: 'system', content: INTENT_PROMPT },
      { role: 'user', content: message },
    ],
  })

  const text = response.choices[0]?.message?.content || ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  try {
    return JSON.parse(jsonMatch ? jsonMatch[0] : text) as ParsedAction
  } catch {
    return { intent: 'complex_query', data: {} }
  }
}

export async function analyzeFinances(
  message: string,
  financialContext: string,
  apiKey: string
): Promise<string> {
  const groq = new Groq({ apiKey })

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: `Você é um assistente financeiro pessoal amigável e direto.
Responda em português, de forma concisa e útil (máximo 3 parágrafos).
Use os dados financeiros do usuário para dar respostas precisas.

DADOS FINANCEIROS:
${financialContext}`,
      },
      { role: 'user', content: message },
    ],
  })

  return response.choices[0]?.message?.content || ''
}
