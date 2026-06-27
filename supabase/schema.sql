-- ============================================
-- LevelUp — Supabase Schema
-- Run this in the Supabase SQL editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------
-- PROFILES
-- ----------------------------------------
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own profile" ON profiles
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, split_part(NEW.email, '@', 1));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------
-- SKILLS
-- ----------------------------------------
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT DEFAULT '⚡',
  color TEXT DEFAULT '#1DB954',
  level INTEGER DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  current_xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 20,
  streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_user_id ON skills(user_id);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own skills" ON skills
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- POMODORO SESSIONS
-- ----------------------------------------
CREATE TABLE pomodoro_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  duration_minutes INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

CREATE INDEX idx_pomodoro_user_id ON pomodoro_sessions(user_id);
CREATE INDEX idx_pomodoro_started_at ON pomodoro_sessions(started_at);
ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own sessions" ON pomodoro_sessions
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- LEVEL REWARDS
-- ----------------------------------------
CREATE TABLE level_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE NOT NULL,
  level_reached INTEGER NOT NULL,
  reward_description TEXT NOT NULL,
  redeemed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE level_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own rewards" ON level_rewards
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- TRANSACTIONS
-- ----------------------------------------
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('expense', 'income')),
  amount NUMERIC(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'COMIDA','LAZER','PASSEIOS','ROUPA','GAMES','ASSINATURAS','UBER','AVULSO','SALARIO','FREELA'
  )),
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own transactions" ON transactions
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- FINANCIAL GOALS
-- ----------------------------------------
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  monthly_limit NUMERIC(10,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goals" ON financial_goals
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- MONTHLY INCOME
-- ----------------------------------------
CREATE TABLE monthly_income (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('salary', 'freelance')),
  amount NUMERIC(10,2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  UNIQUE(user_id, source, month, year)
);

ALTER TABLE monthly_income ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own income" ON monthly_income
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- CALENDAR EVENTS
-- ----------------------------------------
CREATE TABLE calendar_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('task', 'reminder', 'event')),
  date DATE NOT NULL,
  time TIME,
  recurrence TEXT DEFAULT 'none' CHECK (recurrence IN ('none', 'daily', 'weekly', 'monthly')),
  notify_before INTEGER,
  skill_id UUID REFERENCES skills(id) ON DELETE SET NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_calendar_user_id ON calendar_events(user_id);
CREATE INDEX idx_calendar_date ON calendar_events(date);
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own events" ON calendar_events
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- SHOPPING ITEMS
-- ----------------------------------------
CREATE TABLE shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  estimated_price NUMERIC(10,2),
  url TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_shopping_user_id ON shopping_items(user_id);
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own shopping" ON shopping_items
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- ACHIEVEMENTS (seed data)
-- ----------------------------------------
CREATE TABLE achievements (
  key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL
);

-- No RLS needed — achievements are public read
CREATE POLICY "Achievements are readable by all" ON achievements FOR SELECT USING (TRUE);
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Seed achievements
INSERT INTO achievements (key, title, description, icon, category) VALUES
  ('first_skill','🌱 Primeiro Passo','Criar a primeira skill','🌱','skills'),
  ('skill_level_5','⚡ Aquecendo','Atingir nível 5 em qualquer skill','⚡','skills'),
  ('skill_level_10','🎯 Especialista','Atingir nível 10','🎯','skills'),
  ('skill_level_20','💎 Mestre','Atingir nível 20','💎','skills'),
  ('skill_level_50','👑 Lendário','Atingir nível 50','👑','skills'),
  ('five_skills','🌟 Polímata','Ter 5 skills cadastradas','🌟','skills'),
  ('three_skills_lvl10','🔱 Arsenal Completo','3 skills acima do nível 10','🔱','skills'),
  ('five_levels_day','🚀 Prodígio','Subir 5 níveis em um dia','🚀','skills'),
  ('three_skills_day','🎪 Multitalentoso','Estudar 3 skills diferentes no mesmo dia','🎪','skills'),
  ('total_xp_10000','🏔️ Everest','Acumular 10.000 XP total','🏔️','skills'),
  ('streak_3','🌤️ Bom Começo','3 dias de streak','🌤️','streaks'),
  ('streak_7','🔥 Chama Viva','7 dias de streak','🔥','streaks'),
  ('streak_14','💪 Consistente','14 dias de streak','💪','streaks'),
  ('streak_30','🏆 Inabalável','30 dias de streak','🏆','streaks'),
  ('streak_60','🌊 Força da Natureza','60 dias de streak','🌊','streaks'),
  ('streak_100','💎 Lenda Viva','100 dias de streak','💎','streaks'),
  ('streak_comeback','🐍 Sem Perdão','Recuperar streak zerado e bater o recorde','🐍','streaks'),
  ('first_pomodoro','🍅 Primeiro Foco','Completar a primeira sessão','🍅','pomodoro'),
  ('pomodoro_10','⏰ Pontual','Completar 10 sessões','⏰','pomodoro'),
  ('pomodoro_50','🧠 Mente Afiada','Completar 50 sessões','🧠','pomodoro'),
  ('pomodoro_200','🤖 Máquina','Completar 200 sessões','🤖','pomodoro'),
  ('pomodoro_midnight','🌙 Coruja','Completar sessão após meia-noite','🌙','pomodoro'),
  ('pomodoro_early','🌅 Madrugador','Completar sessão antes das 7h','🌅','pomodoro'),
  ('pomodoro_4_day','💥 Modo Besta','4 sessões em um dia','💥','pomodoro'),
  ('pomodoro_8_day','🎯 No Flow','8 sessões em um dia','🎯','pomodoro'),
  ('first_expense','📝 Primeiro Gasto','Registrar o primeiro gasto','📝','financial'),
  ('expense_7_days','🧾 Organizado','Registrar gastos por 7 dias seguidos','🧾','financial'),
  ('first_analysis','🔍 Analista','Primeira pergunta complexa ao chat','🔍','financial'),
  ('month_under_budget','🛡️ Guardião','Fechar mês sem ultrapassar nenhuma meta','🛡️','financial'),
  ('three_months_budget','🏦 Mão de Vaca','3 meses sem ultrapassar metas','🏦','financial'),
  ('reduced_category','💸 Controlado','Reduzir gastos em uma categoria por 2 meses','💸','financial'),
  ('exact_budget','🎯 Atirador','Acertar orçamento de categoria com ±2%','🎯','financial'),
  ('five_freelances','🤑 Freelancer','Registrar 5 ganhos avulsos','🤑','financial'),
  ('six_months_tracking','📊 CFO Pessoal','Usar o app por 6 meses com gastos registrados','📊','financial'),
  ('first_shopping','📋 Primeiro Desejo','Adicionar o primeiro item','📋','shopping'),
  ('shopping_10_items','🎁 Lista Grande','Ter 10 itens simultâneos','🎁','shopping'),
  ('purchased_5','✅ Realizador','Marcar 5 itens como comprados','✅','shopping'),
  ('purchased_20','🛍️ Caçador','Marcar 20 itens como comprados','🛍️','shopping'),
  ('shopping_10_links','🔗 Pesquisador','Adicionar 10 itens com link salvo','🔗','shopping'),
  ('first_event','📌 Primeiro Evento','Criar o primeiro evento','📌','calendar'),
  ('ten_events','🗓️ Planejador','Ter 10 eventos cadastrados','🗓️','calendar'),
  ('first_completed','✅ Cumpriu','Marcar um evento como concluído','✅','calendar'),
  ('perfect_week','🎯 Zero Falhas','Cumprir todos os eventos de uma semana','🎯','calendar'),
  ('welcome','👋 Bem-vindo','Primeiro login','👋','general'),
  ('chat_50','💬 Papo Vai','Enviar 50 mensagens no chat','💬','general'),
  ('active_30_days','🤝 Parceiro','Usar o app por 30 dias','🤝','general'),
  ('active_100_days','🏠 Em Casa','Usar o app por 100 dias','🏠','general'),
  ('active_365_days','🌍 Veterano','Usar o app por 365 dias','🌍','general'),
  ('one_year','🎂 Aniversário','Completar 1 ano de conta','🎂','general'),
  ('comeback','🌙 Fantasma','Voltar após 7 dias sem usar','🌙','general'),
  ('profile_complete','🔧 Perfeccionista','Preencher todas as configurações','🔧','general'),
  ('first_reward','🎨 Personalizado','Definir a primeira recompensa "Se Mimar"','🎨','general'),
  ('achievements_15','🏅 Colecionador','Desbloquear 15 conquistas','🏅','general'),
  ('achievements_40','🏆 Lenda do App','Desbloquear 40 conquistas','🏆','general')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------
-- USER ACHIEVEMENTS
-- ----------------------------------------
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_key TEXT REFERENCES achievements(key) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, achievement_key)
);

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own achievements" ON user_achievements
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- PERSONAL GOALS
-- ----------------------------------------
CREATE TABLE personal_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'in_progress', 'achieved')),
  achieved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE personal_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goals" ON personal_goals
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- CHAT MESSAGES
-- ----------------------------------------
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  action_taken TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_user_id ON chat_messages(user_id);
CREATE INDEX idx_chat_created_at ON chat_messages(created_at);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own messages" ON chat_messages
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------
-- PUSH SUBSCRIPTIONS
-- ----------------------------------------
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own subscriptions" ON push_subscriptions
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
