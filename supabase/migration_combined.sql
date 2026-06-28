-- ============================================
-- LevelYouUp — Combined Migration (v2 + v3)
-- Run this in Supabase SQL Editor
-- Safe to run multiple times (uses IF NOT EXISTS / ON CONFLICT DO NOTHING)
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── UPDATE PROFILES ──────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Novato';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS profile_score INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS score_updated_at TIMESTAMPTZ;

-- ── AVATARS ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  base_character TEXT DEFAULT 'warrior',
  head_item TEXT, face_item TEXT, body_item TEXT, accessory_item TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE avatars ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own avatar" ON avatars;
CREATE POLICY "Users manage own avatar" ON avatars USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── WALLET ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_wallet (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  coins INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0
);
ALTER TABLE user_wallet ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own wallet" ON user_wallet;
CREATE POLICY "Users manage own wallet" ON user_wallet USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── CONSUMABLES ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_consumables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  streak_shields INTEGER DEFAULT 0,
  recovery_tokens INTEGER DEFAULT 0,
  xp_boosts INTEGER DEFAULT 0
);
ALTER TABLE user_consumables ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own consumables" ON user_consumables;
CREATE POLICY "Users manage own consumables" ON user_consumables USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── SHOP ITEMS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('head','face','body','accessory','streak_shield','recovery_token','xp_boost')),
  coin_cost INTEGER NOT NULL,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common','rare','epic','legendary')),
  emoji TEXT DEFAULT '🎁'
);

-- ── USER INVENTORY ───────────────────────────────────
CREATE TABLE IF NOT EXISTS user_inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_key TEXT REFERENCES shop_items(key) NOT NULL,
  acquired_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_key)
);
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own inventory" ON user_inventory;
CREATE POLICY "Users manage own inventory" ON user_inventory USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── FRIENDSHIPS ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS friendships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  addressee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(requester_id, addressee_id)
);
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users see own friendships" ON friendships;
DROP POLICY IF EXISTS "Users manage own friend requests" ON friendships;
CREATE POLICY "Users see own friendships" ON friendships USING (auth.uid() = requester_id OR auth.uid() = addressee_id);
CREATE POLICY "Users manage own friend requests" ON friendships WITH CHECK (auth.uid() = requester_id);

-- ── FEED POSTS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS feed_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT DEFAULT 'achievement',
  achievement_key TEXT,
  badge_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_feed_user ON feed_posts(user_id);
ALTER TABLE feed_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Feed posts visible to friends" ON feed_posts;
DROP POLICY IF EXISTS "Users create own posts" ON feed_posts;
CREATE POLICY "Feed posts visible to all" ON feed_posts FOR SELECT USING (TRUE);
CREATE POLICY "Users create own posts" ON feed_posts WITH CHECK (auth.uid() = user_id);

-- ── FEED REACTIONS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS feed_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES feed_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE feed_reactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reactions visible to all" ON feed_reactions;
DROP POLICY IF EXISTS "Users manage own reactions" ON feed_reactions;
CREATE POLICY "Reactions visible to all" ON feed_reactions FOR SELECT USING (TRUE);
CREATE POLICY "Users manage own reactions" ON feed_reactions USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── BADGES ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  key TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_key TEXT REFERENCES badges(key) NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, badge_key)
);
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own badges" ON user_badges;
CREATE POLICY "Users manage own badges" ON user_badges USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── WATER LOGS ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS water_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  amount_ml INTEGER NOT NULL,
  logged_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_water_user ON water_logs(user_id);
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own water logs" ON water_logs;
CREATE POLICY "Users manage own water logs" ON water_logs USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── CHALLENGE POOL ───────────────────────────────────
CREATE TABLE IF NOT EXISTS challenge_pool (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  reward_coins INTEGER DEFAULT 100,
  icon TEXT DEFAULT '🎯'
);

-- ── WEEKLY CHALLENGES ────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_key TEXT REFERENCES challenge_pool(key) NOT NULL,
  week_start DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, challenge_key, week_start)
);
ALTER TABLE weekly_challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own challenges" ON weekly_challenges;
CREATE POLICY "Users manage own challenges" ON weekly_challenges USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ── PUSH SUBSCRIPTIONS ───────────────────────────────
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own subscriptions" ON push_subscriptions;
CREATE POLICY "Users manage own subscriptions" ON push_subscriptions USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════
-- SEED DATA
-- ══════════════════════════════════════════════════════

-- ── Shop Items ───────────────────────────────────────
INSERT INTO shop_items (key, name, description, type, coin_cost, rarity, emoji) VALUES
  ('streak_shield','Escudo de Streak','Protege seu streak por 1 dia perdido','streak_shield',50,'common','🛡️'),
  ('recovery_token','Token de Recuperação','Restaura um streak zerado','recovery_token',200,'rare','🔄'),
  ('xp_boost','Boost de XP 2x','Dobra o XP ganho por 24h','xp_boost',150,'rare','⚡'),
  ('crown','Coroa Real','Um símbolo de poder supremo','head',300,'legendary','👑'),
  ('wizard_hat','Chapéu de Mago','Conjure seu potencial máximo','head',150,'epic','🎩'),
  ('helmet','Capacete de Batalha','Proteção na jornada épica','head',80,'rare','⛑️'),
  ('laurel','Coroa de Louros','Para os vitoriosos','head',200,'epic','🌿'),
  ('sunglasses','Óculos Escuros','Para os descolados do reino','face',60,'common','😎'),
  ('monocle','Monóculo','Sofisticação pura','face',100,'rare','🧐'),
  ('mask','Máscara Mística','Guardador de segredos antigos','face',180,'epic','🎭'),
  ('armor','Armadura Épica','Forjada nas profundezas do abismo','body',250,'epic','🥋'),
  ('robe','Manto do Sábio','Sabedoria ancestral incorporada','body',200,'rare','🧥'),
  ('cape','Capa do Herói','Para os verdadeiramente lendários','body',350,'legendary','🦸'),
  ('sword_acc','Espada Lendária','Cortando objetivos desde sempre','accessory',300,'legendary','⚔️'),
  ('crystal','Orbe de Cristal','Energia mística concentrada','accessory',180,'epic','🔮'),
  ('scroll_acc','Pergaminho Sagrado','Conhecimento infinito em pergaminho','accessory',120,'rare','📜'),
  ('shield_acc','Escudo de Batalha','Defesa suprema do reino','accessory',200,'epic','🛡️')
ON CONFLICT (key) DO NOTHING;

-- ── Badges ───────────────────────────────────────────
INSERT INTO badges (key, title, description, icon, requirement_type, requirement_value) VALUES
  ('seedling','🌱 Seedling','1 dia usando o app','🌱','days_active',1),
  ('week_warrior','🔥 Week Warrior','7 dias ativos','🔥','days_active',7),
  ('fortnight','💪 Fortnight Fighter','14 dias ativos','💪','days_active',14),
  ('monthly','🏅 Monthly Guardian','30 dias ativos','🏅','days_active',30),
  ('diamond_streak','💎 Diamond Streak','50 dias de streak em qualquer skill','💎','max_skill_streak',50),
  ('century','👑 Century Legend','100 dias ativos','👑','days_active',100),
  ('dedicated','🌍 The Dedicated','200 dias ativos','🌍','days_active',200),
  ('hall_of_fame','🏆 Hall of Fame','365 dias ativos','🏆','days_active',365),
  ('skill_seeker','⚔️ Skill Seeker','3 skills acima do nível 5','⚔️','skills_above_5',3),
  ('scholar','🧙 The Scholar','Qualquer skill no nível 15','🧙','skill_level',15),
  ('budget_master','💰 Budget Master','6 meses sem ultrapassar metas','💰','months_under_budget',6),
  ('pomodoro_knight','🍅 Pomodoro Knight','100 sessões Pomodoro','🍅','pomodoro_total',100),
  ('machine','🤖 The Machine','500 sessões Pomodoro','🤖','pomodoro_total',500),
  ('hydration_hero','💧 Hydration Hero','Meta de água por 30 dias seguidos','💧','water_streak',30),
  ('unstoppable','🌊 The Unstoppable','60 dias de streak em qualquer skill','🌊','max_skill_streak',60)
ON CONFLICT (key) DO NOTHING;

-- ── Challenge Pool ───────────────────────────────────
INSERT INTO challenge_pool (key, title, description, type, target_value, reward_coins, icon) VALUES
  ('pomodoro_5','Foco Total','Complete 5 sessões Pomodoro esta semana','pomodoro_count',5,100,'🍅'),
  ('pomodoro_10','Máquina de Foco','Complete 10 sessões Pomodoro esta semana','pomodoro_count',10,200,'🤖'),
  ('skill_4days','Constância','Estude a mesma skill por 4 dias seguidos','skill_streak_4',4,150,'⚔️'),
  ('water_week','Hidratado','Bata a meta de água todos os dias da semana','water_daily_goal',7,100,'💧'),
  ('events_week','Zero Falhas','Complete todos os eventos do calendário esta semana','calendar_completion',100,150,'📅'),
  ('xp_200','Ganho de XP','Ganhe 200 XP em qualquer skill esta semana','xp_earned',200,100,'⚡'),
  ('expense_daily','Registro Diário','Registre ao menos 1 gasto por dia esta semana','expense_daily',7,100,'💰'),
  ('pomodoro_morning','Madrugador','Complete 3 Pomodoros antes do meio-dia','pomodoro_before_noon',3,120,'🌅'),
  ('no_lazer','Segura o Lazer','Não gaste nada em LAZER esta semana','no_category_spend',0,200,'🎮'),
  ('skill_5day_streak','Streak de Skill','Mantenha streak em qualquer skill por 5 dias','any_skill_streak',5,150,'🔥'),
  ('pomodoro_3skills','Polímata','Faça Pomodoros em 3 skills diferentes esta semana','skills_pomodoro',3,180,'🎪'),
  ('xp_500','Grind Épico','Ganhe 500 XP esta semana','xp_earned',500,250,'💎')
ON CONFLICT (key) DO NOTHING;

-- ── Achievements (new v2+v3) ─────────────────────────
INSERT INTO achievements (key, title, description, icon, category) VALUES
  -- Water
  ('water_first','💧 First Sip','Registrar água pela primeira vez','💧','water'),
  ('water_goal_1','🥤 Hidratado','Bater a meta diária de água uma vez','🥤','water'),
  ('water_streak_7','🌊 Flow State','Meta de água por 7 dias seguidos','🌊','water'),
  ('water_streak_30','💎 Hydration Hero','Meta de água por 30 dias seguidos','💎','water'),
  ('water_total_100','🚿 100 Dias Hidratado','Bater meta em 100 dias separados','🚿','water'),
  -- Shop
  ('first_purchase','🛒 Primeira Compra','Fazer a primeira compra na loja','🛒','shop'),
  ('big_spender','💸 Big Spender','Gastar 1000 moedas no total','💸','shop'),
  ('collector','🎒 Colecionador','Ter 5 itens cosméticos','🎒','shop'),
  ('fashionista','👑 Fashionista','Equipar cosméticos em todos os slots','👑','shop'),
  ('shield_used','🛡️ Protegido','Usar um Escudo de Streak pela primeira vez','🛡️','shop'),
  ('comeback_token','🔄 Comeback Arc','Usar um Token de Recuperação','🔄','shop'),
  -- Social
  ('first_friend','🤝 Not Alone','Adicionar o primeiro amigo','🤝','social'),
  ('social_5','👥 Squad Goals','Ter 5 amigos','👥','social'),
  ('first_reaction','🔥 Hype Man','Reagir ao achievement de um amigo','🔥','social'),
  ('first_share','📣 Showoff','Ter um achievement no feed','📣','social'),
  ('popular','🌟 Popular','Receber 10 reações no feed','🌟','social'),
  -- Challenges
  ('first_challenge','🎯 Challenger','Completar o primeiro desafio semanal','🎯','challenges'),
  ('challenges_5','⚡ On a Roll','Completar 5 desafios semanais','⚡','challenges'),
  ('challenges_perfect','🏆 Semana Perfeita','Completar os 3 desafios em uma semana','🏆','challenges'),
  ('challenges_10','🔥 Challenge Addict','Completar 10 desafios semanais','🔥','challenges'),
  -- Profile
  ('profile_setup','🧑 Identidade','Completar o perfil (nome, username, avatar)','🧑','profile'),
  ('score_500','📈 Rising Star','Atingir Score de Perfil 500','📈','profile'),
  ('score_750','🌟 Elite','Atingir Score de Perfil 750','🌟','profile'),
  ('score_1000','👑 Perfeição','Atingir Score de Perfil 1000','👑','profile'),
  ('first_badge','🎖️ Decorado','Ganhar o primeiro badge','🎖️','profile'),
  ('badges_5','🏅 Medalhista','Ganhar 5 badges','🏅','profile'),
  -- Habits
  ('night_owl_2','🦉 Night Shift','Completar 3 Pomodoros após 22h','🦉','habits'),
  ('early_bird_2','🌄 Dawn Grinder','Completar 3 Pomodoros antes das 7h','🌄','habits'),
  ('allrounder','🌐 All-Rounder','Água, skill e gasto no mesmo dia','🌐','habits'),
  ('triple_streak','🔥🔥🔥 Triple Threat','3 skills com streaks ativos','🔥','habits'),
  -- Financial
  ('no_spend_day','🚫 No Spend Day','Um dia sem gastos discricionários','🚫','financial'),
  ('no_spend_week','🧊 Ice Cold','5 No Spend Days em uma semana','🧊','financial'),
  ('income_growth','📈 Growth Mindset','Freela por 3 meses seguidos','📈','financial'),
  -- Milestones
  ('xp_total_50000','💥 XP Machine','Acumular 50.000 XP total','💥','milestones'),
  ('level_up_50','🚀 Relentless','Subir de nível 50 vezes no total','🚀','milestones'),
  ('pomodoro_100','🍅 Centurion','100 sessões Pomodoro','🍅','milestones'),
  ('pomodoro_365','🌍 Year of Focus','365 sessões Pomodoro','🌍','milestones'),
  ('all_modules','🗺️ Explorer','Usar todos os módulos do app','🗺️','milestones')
ON CONFLICT (key) DO NOTHING;
