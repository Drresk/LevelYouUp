import { Achievement } from '@/types'

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Skills
  { key: 'first_skill', title: '🌱 Primeiro Passo', description: 'Criar a primeira skill', icon: '🌱', category: 'skills' },
  { key: 'skill_level_5', title: '⚡ Aquecendo', description: 'Atingir nível 5 em qualquer skill', icon: '⚡', category: 'skills' },
  { key: 'skill_level_10', title: '🎯 Especialista', description: 'Atingir nível 10 em qualquer skill', icon: '🎯', category: 'skills' },
  { key: 'skill_level_20', title: '💎 Mestre', description: 'Atingir nível 20 em qualquer skill', icon: '💎', category: 'skills' },
  { key: 'skill_level_50', title: '👑 Lendário', description: 'Atingir nível 50 em qualquer skill', icon: '👑', category: 'skills' },
  { key: 'five_skills', title: '🌟 Polímata', description: 'Ter 5 skills cadastradas', icon: '🌟', category: 'skills' },
  { key: 'three_skills_lvl10', title: '🔱 Arsenal Completo', description: '3 skills acima do nível 10', icon: '🔱', category: 'skills' },
  { key: 'five_levels_day', title: '🚀 Prodígio', description: 'Subir 5 níveis em um dia', icon: '🚀', category: 'skills' },
  { key: 'three_skills_day', title: '🎪 Multitalentoso', description: 'Estudar 3 skills diferentes no mesmo dia', icon: '🎪', category: 'skills' },
  { key: 'total_xp_10000', title: '🏔️ Everest', description: 'Acumular 10.000 XP total', icon: '🏔️', category: 'skills' },
  // Streaks
  { key: 'streak_3', title: '🌤️ Bom Começo', description: '3 dias de streak', icon: '🌤️', category: 'streaks' },
  { key: 'streak_7', title: '🔥 Chama Viva', description: '7 dias de streak', icon: '🔥', category: 'streaks' },
  { key: 'streak_14', title: '💪 Consistente', description: '14 dias de streak', icon: '💪', category: 'streaks' },
  { key: 'streak_30', title: '🏆 Inabalável', description: '30 dias de streak', icon: '🏆', category: 'streaks' },
  { key: 'streak_60', title: '🌊 Força da Natureza', description: '60 dias de streak', icon: '🌊', category: 'streaks' },
  { key: 'streak_100', title: '💎 Lenda Viva', description: '100 dias de streak', icon: '💎', category: 'streaks' },
  { key: 'streak_comeback', title: '🐍 Sem Perdão', description: 'Recuperar streak zerado e bater o recorde', icon: '🐍', category: 'streaks' },
  // Pomodoro
  { key: 'first_pomodoro', title: '🍅 Primeiro Foco', description: 'Completar a primeira sessão', icon: '🍅', category: 'pomodoro' },
  { key: 'pomodoro_10', title: '⏰ Pontual', description: 'Completar 10 sessões', icon: '⏰', category: 'pomodoro' },
  { key: 'pomodoro_50', title: '🧠 Mente Afiada', description: 'Completar 50 sessões', icon: '🧠', category: 'pomodoro' },
  { key: 'pomodoro_200', title: '🤖 Máquina', description: 'Completar 200 sessões', icon: '🤖', category: 'pomodoro' },
  { key: 'pomodoro_midnight', title: '🌙 Coruja', description: 'Completar sessão após meia-noite', icon: '🌙', category: 'pomodoro' },
  { key: 'pomodoro_early', title: '🌅 Madrugador', description: 'Completar sessão antes das 7h', icon: '🌅', category: 'pomodoro' },
  { key: 'pomodoro_4_day', title: '💥 Modo Besta', description: '4 sessões em um dia', icon: '💥', category: 'pomodoro' },
  { key: 'pomodoro_8_day', title: '🎯 No Flow', description: '8 sessões em um dia', icon: '🎯', category: 'pomodoro' },
  // Financial
  { key: 'first_expense', title: '📝 Primeiro Gasto', description: 'Registrar o primeiro gasto', icon: '📝', category: 'financial' },
  { key: 'expense_7_days', title: '🧾 Organizado', description: 'Registrar gastos por 7 dias seguidos', icon: '🧾', category: 'financial' },
  { key: 'first_analysis', title: '🔍 Analista', description: 'Primeira pergunta complexa ao chat', icon: '🔍', category: 'financial' },
  { key: 'month_under_budget', title: '🛡️ Guardião', description: 'Fechar mês sem ultrapassar nenhuma meta', icon: '🛡️', category: 'financial' },
  { key: 'three_months_budget', title: '🏦 Mão de Vaca', description: '3 meses sem ultrapassar metas', icon: '🏦', category: 'financial' },
  { key: 'reduced_category', title: '💸 Controlado', description: 'Reduzir gastos em uma categoria por 2 meses', icon: '💸', category: 'financial' },
  { key: 'exact_budget', title: '🎯 Atirador', description: 'Acertar orçamento de categoria com ±2%', icon: '🎯', category: 'financial' },
  { key: 'five_freelances', title: '🤑 Freelancer', description: 'Registrar 5 ganhos avulsos', icon: '🤑', category: 'financial' },
  { key: 'six_months_tracking', title: '📊 CFO Pessoal', description: 'Usar o app por 6 meses com gastos registrados', icon: '📊', category: 'financial' },
  // Shopping
  { key: 'first_shopping', title: '📋 Primeiro Desejo', description: 'Adicionar o primeiro item', icon: '📋', category: 'shopping' },
  { key: 'shopping_10_items', title: '🎁 Lista Grande', description: 'Ter 10 itens simultâneos', icon: '🎁', category: 'shopping' },
  { key: 'purchased_5', title: '✅ Realizador', description: 'Marcar 5 itens como comprados', icon: '✅', category: 'shopping' },
  { key: 'purchased_20', title: '🛍️ Caçador', description: 'Marcar 20 itens como comprados', icon: '🛍️', category: 'shopping' },
  { key: 'shopping_10_links', title: '🔗 Pesquisador', description: 'Adicionar 10 itens com link salvo', icon: '🔗', category: 'shopping' },
  // Calendar
  { key: 'first_event', title: '📌 Primeiro Evento', description: 'Criar o primeiro evento', icon: '📌', category: 'calendar' },
  { key: 'ten_events', title: '🗓️ Planejador', description: 'Ter 10 eventos cadastrados', icon: '🗓️', category: 'calendar' },
  { key: 'first_completed', title: '✅ Cumpriu', description: 'Marcar um evento como concluído', icon: '✅', category: 'calendar' },
  { key: 'perfect_week', title: '🎯 Zero Falhas', description: 'Cumprir todos os eventos de uma semana', icon: '🎯', category: 'calendar' },
  // General
  { key: 'welcome', title: '👋 Bem-vindo', description: 'Primeiro login', icon: '👋', category: 'general' },
  { key: 'chat_50', title: '💬 Papo Vai', description: 'Enviar 50 mensagens no chat', icon: '💬', category: 'general' },
  { key: 'active_30_days', title: '🤝 Parceiro', description: 'Usar o app por 30 dias', icon: '🤝', category: 'general' },
  { key: 'active_100_days', title: '🏠 Em Casa', description: 'Usar o app por 100 dias', icon: '🏠', category: 'general' },
  { key: 'active_365_days', title: '🌍 Veterano', description: 'Usar o app por 365 dias', icon: '🌍', category: 'general' },
  { key: 'one_year', title: '🎂 Aniversário', description: 'Completar 1 ano de conta', icon: '🎂', category: 'general' },
  { key: 'comeback', title: '🌙 Fantasma', description: 'Voltar após 7 dias sem usar', icon: '🌙', category: 'general' },
  { key: 'profile_complete', title: '🔧 Perfeccionista', description: 'Preencher todas as configurações', icon: '🔧', category: 'general' },
  { key: 'first_reward', title: '🎨 Personalizado', description: 'Definir a primeira recompensa "Se Mimar"', icon: '🎨', category: 'general' },
  { key: 'achievements_15', title: '🏅 Colecionador', description: 'Desbloquear 15 conquistas', icon: '🏅', category: 'general' },
  { key: 'achievements_40', title: '🏆 Lenda do App', description: 'Desbloquear 40 conquistas', icon: '🏆', category: 'general' },
]

export function getAchievement(key: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find((a) => a.key === key)
}

export const ACHIEVEMENT_CATEGORIES = {
  skills: '⚔️ Skills',
  streaks: '🔥 Streaks',
  pomodoro: '🍅 Pomodoro',
  financial: '💰 Financeiro',
  shopping: '🛒 Compras',
  calendar: '📅 Calendário',
  general: '🌐 Geral',
}
