
-- Remove the problematic foreign key constraint from aluno_profiles
ALTER TABLE public.aluno_profiles DROP CONSTRAINT IF EXISTS aluno_profiles_user_id_fkey;

-- Remove the problematic foreign key constraint from professor_profiles
ALTER TABLE public.professor_profiles DROP CONSTRAINT IF EXISTS professor_profiles_user_id_fkey;

-- Remove the problematic foreign key constraint from admin_users
ALTER TABLE public.admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

-- Ensure we don't have any references to a non-existent users table
-- The user_id columns should reference auth.users but we can't create foreign keys to auth schema
-- So we'll rely on application-level consistency instead
