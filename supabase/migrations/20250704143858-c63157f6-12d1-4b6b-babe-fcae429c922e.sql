
-- Primeiro, vamos limpar qualquer usuário existente com esse email
DELETE FROM admin_users WHERE email = 'jesse_cma@hotmail.com';
DELETE FROM auth.users WHERE email = 'jesse_cma@hotmail.com';

-- Criar usuário admin usando o método correto do Supabase
-- Vamos usar a função auth.users para criar o usuário corretamente
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'jesse_cma@hotmail.com',
  crypt('teste123', gen_salt('bf')),
  now(),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Jessé Brendon"}',
  false,
  now(),
  now(),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null
);

-- Criar perfil de admin na tabela admin_users
INSERT INTO admin_users (
  user_id,
  nome,
  email,
  status
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'jesse_cma@hotmail.com' ORDER BY created_at DESC LIMIT 1),
  'Jessé Brendon',
  'jesse_cma@hotmail.com',
  'ativo'
);
