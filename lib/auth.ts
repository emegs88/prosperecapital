/**
 * Sistema de Autenticação
 * Dados de login e gerenciamento de usuários
 */

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'investor';
  createdAt: Date;
  lastLogin?: Date;
}

// Usuários mockados (em produção, viria de banco de dados)
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'emerson@prospere.com.br',
    password: '142827',
    name: 'Emerson Gomes dos Santos',
    role: 'admin',
    createdAt: new Date('2025-01-01'),
    lastLogin: new Date(),
  },
  {
    id: '2',
    email: 'joao@example.com',
    password: '123456',
    name: 'João Silva',
    role: 'investor',
    createdAt: new Date('2023-01-15'),
  },
];

/**
 * Verifica credenciais de login
 */
export function verifyLogin(email: string, password: string): User | null {
  const user = mockUsers.find(u => u.email === email && u.password === password);
  if (user) {
    // Atualiza último login
    user.lastLogin = new Date();
    return user;
  }
  return null;
}

/**
 * Cria novo usuário
 */
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
  };
  mockUsers.push(newUser);
  return newUser;
}

/**
 * Verifica se usuário está autenticado (simulado)
 */
export function getCurrentUser(): User | null {
  // Em produção, viria de session/cookie
  return mockUsers.find(u => u.email === 'emerson@prospere.com.br') || null;
}
