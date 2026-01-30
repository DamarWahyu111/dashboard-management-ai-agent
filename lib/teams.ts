// Team management system

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'lead' | 'member';
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdBy: string;
  createdAt: Date;
}

const TEAMS_STORAGE_KEY = 'teams';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function getAllTeams(): Team[] {
  try {
    const data = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (!data) return [];
    const teams = JSON.parse(data);
    return teams.map((t: any) => ({
      ...t,
      createdAt: new Date(t.createdAt)
    }));
  } catch {
    return [];
  }
}

export function createTeam(name: string, description: string, userId: string, userName: string): Team {
  const teams = getAllTeams();
  const newTeam: Team = {
    id: generateId(),
    name,
    description,
    members: [
      {
        id: userId,
        name: userName,
        email: userId,
        role: 'lead'
      }
    ],
    createdBy: userId,
    createdAt: new Date()
  };
  teams.push(newTeam);
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  return newTeam;
}

export function getTeamById(teamId: string): Team | null {
  const teams = getAllTeams();
  return teams.find(t => t.id === teamId) || null;
}

export function addMemberToTeam(teamId: string, member: TeamMember): Team | null {
  const teams = getAllTeams();
  const team = teams.find(t => t.id === teamId);
  if (!team) return null;
  
  if (!team.members.find(m => m.id === member.id)) {
    team.members.push(member);
    localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  }
  return team;
}

export function removeMemberFromTeam(teamId: string, memberId: string): Team | null {
  const teams = getAllTeams();
  const team = teams.find(t => t.id === teamId);
  if (!team) return null;
  
  team.members = team.members.filter(m => m.id !== memberId);
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  return team;
}

export function updateTeam(teamId: string, updates: Partial<Team>): Team | null {
  const teams = getAllTeams();
  const teamIndex = teams.findIndex(t => t.id === teamId);
  if (teamIndex === -1) return null;
  
  teams[teamIndex] = { ...teams[teamIndex], ...updates };
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(teams));
  return teams[teamIndex];
}

export function deleteTeam(teamId: string): boolean {
  const teams = getAllTeams();
  const filteredTeams = teams.filter(t => t.id !== teamId);
  
  if (filteredTeams.length === teams.length) {
    return false; // Team not found
  }
  
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(filteredTeams));
  return true;
}
