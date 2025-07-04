
-- Criar usuário admin no sistema de autenticação
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  gen_random_uuid(),
  'jesse_cma@hotmail.com',
  crypt('teste123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Jessé Brendon"}',
  false,
  'authenticated'
);

-- Criar perfil de admin na tabela admin_users
INSERT INTO admin_users (
  user_id,
  nome,
  email,
  status
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'jesse_cma@hotmail.com'),
  'Jessé Brendon',
  'jesse_cma@hotmail.com',
  'ativo'
);
