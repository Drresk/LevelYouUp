import Groq from 'groq-sdk'

export type ChatIntent =
  | 'register_expense'
  | 'register_income'
  | 'add_calendar_event'
  | 'log_water'
  | 'complex_query'

export interface ParsedAction {
  intent: ChatIntent
  data: Record<string, unknown>
}

const INTENT_PROMPT = `You are a classifier for a personal assistant app. Classify the user message into one of these intents:

- register_expense: spending money (gastei, paguei, comprei, custou, etc.)
- register_income: receiving money (recebi, ganhei, salário, freela, etc.)
- add_calendar_event: scheduling something (reunião, evento, lembra, compromisso, às Xh, etc.)
- log_water: drinking water (bebi, tomei água, xícaras, ml, copos d'água, hidratei, etc.)
- complex_query: financial analysis, comparisons, advice, or anything else

Respond ONLY with a JSON object like:
{
  "intent": "<intent>",
  "data": {
    // register_expense/income: amount (number), category (string), description (string)
    // add_calendar_event: title (string), date (string YYYY-MM-DD), time (string HH:MM or null), type ("task"|"reminder"|"event")
    // log_water: amount_ml (number — convert glasses/copos to ml: 1 copo=250ml, 1 garrafa=500ml)
    // complex_query: {}
  }
}

Valid expense categories: COMIDA, LAZER, PASSEIOS, ROUPA, GAMES, ASSINATURAS, UBER, AVULSO
Valid income categories: SALARIO, FREELA
Today: ${new Date().toISOString().split('T')[0]}`

export async function classifyIntent(message: string, apiKey: string): Promise<ParsedAction> {
  const groq = new Groq({ apiKey })
  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 512,
    temperature: 0,
    messages: [{ role: 'system', content: INTENT_PROMPT }, { role: 'user', content: message }],
  })
  const text = response.choices[0]?.message?.content || ''
  const match = text.match(/\{[\s\S]*\}/)
  try { return JSON.parse(match ? match[0] : text) as ParsedAction }
  catch { return { intent: 'complex_query', data: {} } }
}

export async function analyzeFinances(message: string, context: string, apiKey: string): Promise<string> {
  const groq = new Groq({ apiKey })
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages: [
      { role: 'system', content: `Você é um assistente financeiro pessoal amigável e direto. Responda em português, de forma concisa (máx. 3 parágrafos). Use os dados abaixo:\n\n${context}` },
      { role: 'user', content: message },
    ],
  })
  return response.choices[0]?.message?.content || ''
}
