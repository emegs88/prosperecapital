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
 * Verifica se usuário está autenticado
 */
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      // Buscar dados atualizados do mockUsers
      const fullUser = mockUsers.find(u => u.id === user.id || u.email === user.email);
      return fullUser || user;
    }
  } catch (error) {
    console.error('Erro ao ler usuário do localStorage:', error);
  }
  
  return null;
}

/**
 * Salva usuário no localStorage
 */
export function setCurrentUser(user: User): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }));
  } catch (error) {
    console.error('Erro ao salvar usuário no localStorage:', error);
  }
}

/**
 * Verifica se o usuário atual é admin
 */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Verifica se o usuário atual é investidor
 */
export function isInvestor(): boolean {
  const user = getCurrentUser();
  return user?.role === 'investor';
}
