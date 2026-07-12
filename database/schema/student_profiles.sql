-- Reference schema snapshot for student_profiles.
-- Source of truth for execution is database/supabase/migrations.

create table public.student_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 120),
  email text not null check (position('@' in email) > 1),
  preferred_learning_language text not null default 'en',
  academic_level text,
  profile_image_url text,
  subscription_status text not null default 'free',
  onboarding_status text not null default 'profile_pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_profiles_subscription_status_check
    check (subscription_status in ('free', 'premium', 'group', 'expired')),
  constraint student_profiles_onboarding_status_check
    check (onboarding_status in ('profile_pending', 'academic_pending', 'completed'))
);
