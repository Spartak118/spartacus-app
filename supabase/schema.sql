-- SPARTACUS Database Schema
-- Run this in your Supabase SQL editor

-- Enable Row Level Security on all tables

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);


-- Profiles table (fitness data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  age INTEGER CHECK (age > 0 AND age < 120),
  height NUMERIC(5,1) CHECK (height > 0),
  weight NUMERIC(5,1) CHECK (weight > 0),
  target_weight NUMERIC(5,1) CHECK (target_weight > 0),
  body_fat NUMERIC(4,1),
  goal TEXT CHECK (goal IN ('lose_fat', 'build_muscle', 'aesthetic', 'greek_god', 'athletic', 'beginner')),
  gym_access TEXT CHECK (gym_access IN ('home', 'gym', 'both')),
  experience TEXT CHECK (experience IN ('beginner', 'some', 'intermediate', 'advanced')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'very_active')),
  workout_days TEXT[] DEFAULT '{}',
  units TEXT DEFAULT 'metric' CHECK (units IN ('metric', 'imperial')),
  plan JSONB,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile data" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile data" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile data" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can upsert own profile data" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);


-- Workouts log
CREATE TABLE IF NOT EXISTS public.workouts_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workout_id TEXT NOT NULL,
  workout_name TEXT NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  duration INTEGER NOT NULL CHECK (duration > 0),
  exercises_completed INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.workouts_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workout logs" ON public.workouts_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workout logs" ON public.workouts_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workout logs" ON public.workouts_log
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_workouts_log_user_date ON public.workouts_log(user_id, completed_at DESC);


-- Nutrition log
CREATE TABLE IF NOT EXISTS public.nutrition_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calories INTEGER DEFAULT 0 CHECK (calories >= 0),
  protein NUMERIC(6,1) DEFAULT 0 CHECK (protein >= 0),
  carbs NUMERIC(6,1) DEFAULT 0 CHECK (carbs >= 0),
  fat NUMERIC(6,1) DEFAULT 0 CHECK (fat >= 0),
  water INTEGER DEFAULT 0 CHECK (water >= 0),
  meals JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.nutrition_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition logs" ON public.nutrition_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition logs" ON public.nutrition_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs" ON public.nutrition_log
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_nutrition_log_user_date ON public.nutrition_log(user_id, date DESC);


-- Weight log
CREATE TABLE IF NOT EXISTS public.weight_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight NUMERIC(5,1) NOT NULL CHECK (weight > 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.weight_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own weight logs" ON public.weight_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs" ON public.weight_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight logs" ON public.weight_log
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_weight_log_user_date ON public.weight_log(user_id, date DESC);


-- Measurements log
CREATE TABLE IF NOT EXISTS public.measurements_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  measurements JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.measurements_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own measurements" ON public.measurements_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own measurements" ON public.measurements_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_measurements_log_user_date ON public.measurements_log(user_id, date DESC);


-- Sleep log
CREATE TABLE IF NOT EXISTS public.sleep_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  bedtime TIME NOT NULL,
  wake_time TIME NOT NULL,
  duration NUMERIC(4,2) NOT NULL CHECK (duration > 0),
  quality INTEGER CHECK (quality BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, date)
);

ALTER TABLE public.sleep_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sleep logs" ON public.sleep_log
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sleep logs" ON public.sleep_log
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sleep logs" ON public.sleep_log
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX idx_sleep_log_user_date ON public.sleep_log(user_id, date DESC);


-- Streaks
CREATE TABLE IF NOT EXISTS public.streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER DEFAULT 0 CHECK (longest_streak >= 0),
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own streak" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own streak" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);


-- Function to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );

  INSERT INTO public.streaks (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_nutrition_updated_at
  BEFORE UPDATE ON public.nutrition_log
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
