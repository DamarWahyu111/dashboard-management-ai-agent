'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getAllTeams, createTeam, addMemberToTeam, removeMemberFromTeam } from '@/lib/teams';
import { Plus, Trash2, UserPlus } from 'lucide-react';

interface TeamsManagerProps {
  userId: string;
  userName: string;
}

export function TeamsManager({ userId, userName }: TeamsManagerProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = () => {
    const allTeams = getAllTeams();
    setTeams(allTeams);
  };

  const handleCreateTeam = () => {
    if (!teamName.trim()) return;
    createTeam(teamName, teamDesc, userId, userName);
    setTeamName('');
    setTeamDesc('');
    loadTeams();
  };

  const handleAddMember = () => {
    if (!newMemberEmail.trim() || !selectedTeamId) return;
    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      role: 'member' as const,
    };
    addMemberToTeam(selectedTeamId, newMember);
    setNewMemberEmail('');
    loadTeams();
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    removeMemberFromTeam(teamId, memberId);
    loadTeams();
  };

  return (
    <div className="space-y-6">
      {/* Create Team Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus size={18} className="mr-2" />
            Create Team
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white">Create New Team</DialogTitle>
            <DialogDescription>
              Create a team and start managing members
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Input
              placeholder="Team Description"
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button
              onClick={handleCreateTeam}
              disabled={!teamName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Create Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Teams List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.length === 0 ? (
          <Card className="bg-slate-800 border-slate-700 md:col-span-2">
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center py-8">No teams yet. Create one to get started!</p>
            </CardContent>
          </Card>
        ) : (
          teams.map((team) => (
            <Card key={team.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{team.name}</CardTitle>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Members List */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3">Members ({team.members.length})</h4>
                  <div className="space-y-2">
                    {team.members.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 rounded bg-slate-700"
                      >
                        <div>
                          <p className="text-sm text-white font-medium">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.email}</p>
                        </div>
                        {member.id !== userId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(team.id, member.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          >
                            <Trash2 size={16} />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add Member */}
                <div className="space-y-2 pt-4 border-t border-slate-700">
                  <div className="flex gap-2">
                    <Input
                      placeholder="member@email.com"
                      value={selectedTeamId === team.id ? newMemberEmail : ''}
                      onChange={(e) => {
                        setSelectedTeamId(team.id);
                        setNewMemberEmail(e.target.value);
                      }}
                      onFocus={() => setSelectedTeamId(team.id)}
                      className="bg-slate-700 border-slate-600 text-white text-sm"
                    />
                    <Button
                      onClick={handleAddMember}
                      disabled={selectedTeamId !== team.id || !newMemberEmail.trim()}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <UserPlus size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
