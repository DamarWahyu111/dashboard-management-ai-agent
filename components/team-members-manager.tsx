'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserPlus,
  Key,
  Copy,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { 
  getAllMembers, 
  getMembersByTeam, 
  createAdminMember,
  generateTeamKey,
  getAllKeys,
  getKeysByTeam,
  joinTeamWithKey,
  removeMember,
  isAdmin,
  type TeamMember,
  type TeamMemberKey,
} from '@/lib/team-members';
import { getAllTeams } from '@/lib/teams';
import { getCurrentUser } from '@/lib/auth';

export function TeamMembersManager() {
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinKey, setJoinKey] = useState('');
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  const currentUser = getCurrentUser();
  const userIsAdmin = currentUser ? isAdmin(currentUser.id || currentUser.email) : false;
  const teams = getAllTeams();
  const allMembers = getAllMembers();
  const allKeys = getAllKeys();
  
  const teamMembers = useMemo(() => {
    if (!selectedTeam) return [];
    return getMembersByTeam(selectedTeam);
  }, [selectedTeam]);
  
  const teamKeys = useMemo(() => {
    if (!selectedTeam) return [];
    return getKeysByTeam(selectedTeam);
  }, [selectedTeam]);

  const handleCreateAdmin = () => {
    const name = prompt('Enter admin name:');
    const email = prompt('Enter admin email:');
    if (name && email) {
      createAdminMember(name, email);
      alert('Admin member created!');
      window.location.reload();
    }
  };

  const handleGenerateKey = () => {
    if (!selectedTeam) {
      alert('Please select a team first');
      return;
    }
    
    const expiresIn = prompt('Enter expiration days (leave empty for no expiration):');
    const maxUses = prompt('Enter max uses (leave empty for unlimited):');
    
    const key = generateTeamKey(
      selectedTeam,
      currentUser?.id || currentUser?.email || 'system',
      expiresIn ? parseInt(expiresIn) : undefined,
      maxUses ? parseInt(maxUses) : undefined
    );
    
    alert(`Key generated: ${key.key}`);
  };

  const handleJoinTeam = () => {
    if (!joinKey || !joinName || !joinEmail) {
      alert('Please fill all fields');
      return;
    }
    
    const result = joinTeamWithKey(joinKey, joinName, joinEmail);
    if (result.success) {
      alert('Successfully joined team!');
      setShowJoinForm(false);
      setJoinKey('');
      setJoinName('');
      setJoinEmail('');
      window.location.reload();
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRemoveMember = (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeMember(memberId);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Section */}
      {userIsAdmin && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={24} />
              Admin Panel
            </h3>
            <Button
              onClick={handleCreateAdmin}
              className="bg-white text-black hover:bg-gray-200"
            >
              <UserPlus size={16} className="mr-2" />
              Create Admin
            </Button>
          </div>
        </Card>
      )}

      {/* Team Selection */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h3 className="text-xl font-bold text-white mb-4">Select Team</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => setSelectedTeam(team.id)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedTeam === team.id
                  ? 'border-white bg-slate-700 text-white'
                  : 'border-slate-600 bg-slate-900 text-slate-300 hover:border-slate-500'
              }`}
            >
              {team.name}
            </button>
          ))}
        </div>
      </Card>

      {selectedTeam && (
        <>
          {/* Team Members */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">
                Team Members ({teamMembers.length}/20)
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowAddMember(!showAddMember)}
                  className="bg-white text-black hover:bg-gray-200"
                  size="sm"
                >
                  <UserPlus size={16} className="mr-2" />
                  Add Member
                </Button>
                <Button
                  onClick={handleGenerateKey}
                  className="bg-white text-black hover:bg-gray-200"
                  size="sm"
                >
                  <Key size={16} className="mr-2" />
                  Generate Key
                </Button>
              </div>
            </div>

            {/* Join Form */}
            {showJoinForm && (
              <Card className="bg-slate-700 border-slate-600 p-4 mb-4">
                <h4 className="text-white font-semibold mb-3">Join Team with Key</h4>
                <div className="space-y-3">
                  <Input
                    placeholder="Enter key"
                    value={joinKey}
                    onChange={(e) => setJoinKey(e.target.value)}
                    className="bg-slate-800 text-white border-slate-600"
                  />
                  <Input
                    placeholder="Your name"
                    value={joinName}
                    onChange={(e) => setJoinName(e.target.value)}
                    className="bg-slate-800 text-white border-slate-600"
                  />
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={joinEmail}
                    onChange={(e) => setJoinEmail(e.target.value)}
                    className="bg-slate-800 text-white border-slate-600"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleJoinTeam}
                      className="bg-white text-black hover:bg-gray-200 flex-1"
                    >
                      Join Team
                    </Button>
                    <Button
                      onClick={() => setShowJoinForm(false)}
                      variant="outline"
                      className="border-slate-600 text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Members List */}
            <div className="space-y-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center font-semibold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-medium">{member.name}</p>
                      <p className="text-slate-400 text-sm">{member.email}</p>
                    </div>
                    {member.role === 'admin' && (
                      <Badge className="bg-white text-black">Admin</Badge>
                    )}
                  </div>
                  {userIsAdmin && member.role !== 'admin' && (
                    <Button
                      onClick={() => handleRemoveMember(member.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              
              {teamMembers.length === 0 && (
                <p className="text-slate-400 text-center py-4">No members yet</p>
              )}
            </div>
          </Card>

          {/* Team Keys */}
          <Card className="bg-slate-800 border-slate-700 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Team Keys</h3>
            <div className="space-y-2">
              {teamKeys.map((key) => (
                <div
                  key={key.key}
                  className="flex items-center justify-between p-3 bg-slate-700 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-white font-mono text-sm">{key.key}</code>
                      <button
                        onClick={() => handleCopyKey(key.key)}
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedKey === key.key ? (
                          <CheckCircle2 size={16} className="text-green-400" />
                        ) : (
                          <Copy size={16} />
                        )}
                      </button>
                    </div>
                    <div className="flex gap-4 text-xs text-slate-400">
                      <span>Uses: {key.currentUses}{key.maxUses ? `/${key.maxUses}` : ''}</span>
                      {key.expiresAt && (
                        <span>Expires: {new Date(key.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {teamKeys.length === 0 && (
                <p className="text-slate-400 text-center py-4">No keys generated yet</p>
              )}
            </div>
          </Card>
        </>
      )}

      {/* Join Team Button */}
      {!selectedTeam && (
        <Card className="bg-slate-800 border-slate-700 p-6">
          <Button
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            <Key size={16} className="mr-2" />
            Join Team with Key
          </Button>
        </Card>
      )}
    </div>
  );
}
