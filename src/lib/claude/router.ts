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

interface UserCategory {
  id: string
  name: string
  icon_key: string
  color: string
  is_income: boolean
}

function buildIntentPrompt(
  expenseCats: UserCategory[],
  incomeCats: UserCategory[]
): string {
  const expenseNames = expenseCats.length
    ? expenseCats.map(c => c.name).join(', ')
    : 'Comida, Lazer, Uber, Games, Assinaturas, Avulso'

  const incomeNames = incomeCats.length
    ? incomeCats.map(c => c.name).join(', ')
    : 'Salário, Freelance'

  return `You are a classifier for a personal finance assistant app. Classify the user message into one of these intents:

- register_expense: spending money (gastei, paguei, comprei, custou, etc.)
- register_income: receiving money (recebi, ganhei, salário, freela, etc.)
- add_calendar_event: scheduling something (reunião, evento, lembra, compromisso, às Xh, etc.)
- log_water: drinking water (bebi água, tomei, ml, copos, etc.)
- complex_query: financial analysis, comparisons, advice, or anything else

Respond ONLY with a JSON object:
{
  "intent": "<intent>",
  "data": {
    // register_expense: amount (number), category_name (string — must match one of the user's expense categories), description (string)
    // register_income: amount (number), category_name (string — must match one of the user's income categories), description (string)
    // add_calendar_event: title (string), date (string YYYY-MM-DD), time (string HH:MM or null), type ("task"|"reminder"|"event")
    // log_water: amount_ml (number — convert: 1 copo/glass = 250ml, 1 garrafa = 500ml)
    // complex_query: {}
  }
}

USER'S EXPENSE CATEGORIES: ${expenseNames}
USER'S INCOME CATEGORIES: ${incomeNames}

When classifying expenses/income, pick the CLOSEST category name from the user's list.
If nothing fits, use "Avulso" for expenses or the first income category.

Today: ${new Date().toISOString().split('T')[0]}`
}

export async function classifyIntent(
  message: string,
  apiKey: string,
  expenseCats: UserCategory[] = [],
  incomeCats: UserCategory[] = []
): Promise<ParsedAction> {
  const groq = new Groq({ apiKey })

  const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    max_tokens: 512,
    temperature: 0,
    messages: [
      { role: 'system', content: buildIntentPrompt(expenseCats, incomeCats) },
      { role: 'user', content: message },
    ],
  })

  const text = response.choices[0]?.message?.content || ''
  const match = text.match(/\{[\s\S]*\}/)
  try {
    return JSON.parse(match ? match[0] : text) as ParsedAction
  } catch {
    return { intent: 'complex_query', data: {} }
  }
}

export async function analyzeFinances(
  message: string,
  context: string,
  apiKey: string
): Promise<string> {
  const groq = new Groq({ apiKey })

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content: `Você é um assistente financeiro pessoal amigável e direto. Responda em português, de forma concisa (máx. 3 parágrafos). Use os dados abaixo:\n\n${context}`,
      },
      { role: 'user', content: message },
    ],
  })

  return response.choices[0]?.message?.content || ''
}
