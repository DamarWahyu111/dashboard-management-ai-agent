// Team Member Management with Admin and Key System

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  teamId?: string;
  joinedAt: Date;
  key?: string; // Key untuk join team
}

export interface TeamMemberKey {
  key: string;
  teamId: string;
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  maxUses?: number;
  currentUses: number;
}

const MEMBERS_STORAGE_KEY = 'team_members';
const MEMBER_KEYS_STORAGE_KEY = 'team_member_keys';
const MAX_MEMBERS_PER_TEAM = 20;

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateKey(): string {
  return `TM-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now().toString(36).substr(2, 4).toUpperCase()}`;
}

// Get all members
export function getAllMembers(): TeamMember[] {
  try {
    const data = localStorage.getItem(MEMBERS_STORAGE_KEY);
    if (!data) return [];
    const members = JSON.parse(data);
    return members.map((m: any) => ({
      ...m,
      joinedAt: new Date(m.joinedAt)
    }));
  } catch {
    return [];
  }
}

// Get members by team
export function getMembersByTeam(teamId: string): TeamMember[] {
  const members = getAllMembers();
  return members.filter(m => m.teamId === teamId);
}

// Create admin member
export function createAdminMember(name: string, email: string): TeamMember {
  const members = getAllMembers();
  const admin: TeamMember = {
    id: generateId(),
    name,
    email,
    role: 'admin',
    joinedAt: new Date(),
  };
  members.push(admin);
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  return admin;
}

// Generate key for team
export function generateTeamKey(teamId: string, createdBy: string, expiresInDays?: number, maxUses?: number): TeamMemberKey {
  const keys = getAllKeys();
  const key: TeamMemberKey = {
    key: generateKey(),
    teamId,
    createdBy,
    createdAt: new Date(),
    expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : undefined,
    maxUses,
    currentUses: 0,
  };
  keys.push(key);
  localStorage.setItem(MEMBER_KEYS_STORAGE_KEY, JSON.stringify(keys));
  return key;
}

// Get all keys
export function getAllKeys(): TeamMemberKey[] {
  try {
    const data = localStorage.getItem(MEMBER_KEYS_STORAGE_KEY);
    if (!data) return [];
    const keys = JSON.parse(data);
    return keys.map((k: any) => ({
      ...k,
      createdAt: new Date(k.createdAt),
      expiresAt: k.expiresAt ? new Date(k.expiresAt) : undefined,
    }));
  } catch {
    return [];
  }
}

// Get keys by team
export function getKeysByTeam(teamId: string): TeamMemberKey[] {
  const keys = getAllKeys();
  return keys.filter(k => k.teamId === teamId);
}

// Join team with key
export function joinTeamWithKey(key: string, name: string, email: string): { success: boolean; member?: TeamMember; error?: string } {
  const keys = getAllKeys();
  const keyData = keys.find(k => k.key === key);
  
  if (!keyData) {
    return { success: false, error: 'Invalid key' };
  }
  
  // Check expiration
  if (keyData.expiresAt && new Date() > keyData.expiresAt) {
    return { success: false, error: 'Key has expired' };
  }
  
  // Check max uses
  if (keyData.maxUses && keyData.currentUses >= keyData.maxUses) {
    return { success: false, error: 'Key has reached maximum uses' };
  }
  
  // Check team capacity
  const teamMembers = getMembersByTeam(keyData.teamId);
  if (teamMembers.length >= MAX_MEMBERS_PER_TEAM) {
    return { success: false, error: `Team is full (max ${MAX_MEMBERS_PER_TEAM} members)` };
  }
  
  // Check if member already exists
  const members = getAllMembers();
  const existingMember = members.find(m => m.email === email && m.teamId === keyData.teamId);
  if (existingMember) {
    return { success: false, error: 'Member already in team' };
  }
  
  // Create member
  const member: TeamMember = {
    id: generateId(),
    name,
    email,
    role: 'member',
    teamId: keyData.teamId,
    joinedAt: new Date(),
    key: key,
  };
  
  members.push(member);
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
  
  // Update key usage
  keyData.currentUses += 1;
  const keyIndex = keys.findIndex(k => k.key === key);
  if (keyIndex !== -1) {
    keys[keyIndex] = keyData;
    localStorage.setItem(MEMBER_KEYS_STORAGE_KEY, JSON.stringify(keys));
  }
  
  return { success: true, member };
}

// Remove member from team
export function removeMember(memberId: string): boolean {
  const members = getAllMembers();
  const filtered = members.filter(m => m.id !== memberId);
  
  if (filtered.length === members.length) {
    return false;
  }
  
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

// Check if user is admin
export function isAdmin(userId: string): boolean {
  const members = getAllMembers();
  const member = members.find(m => m.id === userId || m.email === userId);
  return member?.role === 'admin';
}

// Get member by ID or email
export function getMemberById(idOrEmail: string): TeamMember | null {
  const members = getAllMembers();
  return members.find(m => m.id === idOrEmail || m.email === idOrEmail) || null;
}
