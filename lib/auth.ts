// Simple auth management for demo
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const USERS_STORAGE_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

export function saveUser(user: User, password: string) {
  const users = getAllUsers();
  const hashedPassword = Buffer.from(password).toString('base64');
  users[user.email] = { ...user, password: hashedPassword };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return user;
}

export function getAllUsers(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

export function authenticateUser(email: string, password: string): User | null {
  const users = getAllUsers();
  const user = users[email];
  if (user && Buffer.from(password).toString('base64') === user.password) {
    return { id: user.id, name: user.name, email: user.email, avatar: user.avatar };
  }
  return null;
}

export function setCurrentUser(user: User) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  try {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function userExists(email: string): boolean {
  return email in getAllUsers();
}
