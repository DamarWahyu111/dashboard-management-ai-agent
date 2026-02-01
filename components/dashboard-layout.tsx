'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { ChevronDown, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { getAllTeams, createTeam, deleteTeam } from '@/lib/teams';
import { joinTeamWithKey } from '@/lib/team-members';
import type { Team } from '@/lib/teams';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string;
  userEmail: string;
}

export function DashboardLayout({ children, userName, userEmail }: DashboardLayoutProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNewTeamForm, setShowNewTeamForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinKey, setJoinKey] = useState('');
  const [joinEmail, setJoinEmail] = useState('');

  useEffect(() => {
    const loadTeams = () => {
      const allTeams = getAllTeams();
      setTeams(allTeams);
      
      // Auto-select first team if exists
      if (allTeams.length > 0 && !selectedTeam) {
        setSelectedTeam(allTeams[0].id);
      }
    };

    loadTeams();
  }, [selectedTeam]);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;

    // createTeam expects 4 arguments: name, createdBy, description, color
    const newTeam = createTeam(newTeamName, userName, '', '');
    setTeams([...teams, newTeam]);
    setSelectedTeam(newTeam.id);
    setNewTeamName('');
    setShowNewTeamForm(false);
  };

  const handleDeleteTeam = (teamId: string) => {
    deleteTeam(teamId);
    setTeams(teams.filter((t) => t.id !== teamId));

    if (selectedTeam === teamId) {
      const remaining = teams.filter((t) => t.id !== teamId);
      setSelectedTeam(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleJoinTeam = () => {
    if (!joinKey || !joinEmail) {
      alert('Mohon isi semua field');
      return;
    }

    // Extract name from email (before @)
    const name = joinEmail.split('@')[0];

    const result = joinTeamWithKey(joinKey, name, joinEmail);
    if (result.success) {
      alert('Berhasil join team!');
      setShowJoinForm(false);
      setJoinKey('');
      setJoinEmail('');
      // Reload teams
      const allTeams = getAllTeams();
      setTeams(allTeams);
      if (allTeams.length > 0) {
        setSelectedTeam(allTeams[0].id);
      }
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  const currentTeam = teams.find((t) => t.id === selectedTeam);

  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar userName={userName} userEmail={userEmail} />

      <div className="flex-1 md:ml-64">
        {/* Top Header with Team Selector */}
        <div className="bg-black border-b border-gray-800 sticky top-0 z-30">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">watsonx MindShare</h1>

            {/* Team Selector Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-white hover:bg-gray-200 text-black flex items-center gap-2"
              >
                {currentTeam ? currentTeam.name : 'Select Team'}
                <ChevronDown size={16} />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg z-40">
                  {/* Existing Teams */}
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-gray-900 border-b border-gray-800 last:border-0"
                    >
                      <button
                        onClick={() => {
                          setSelectedTeam(team.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex-1 text-left text-sm ${
                          selectedTeam === team.id
                            ? 'text-white font-semibold'
                            : 'text-gray-300 hover:text-white'
                        }`}
                      >
                        {team.name}
                      </button>
                      <Button
                        onClick={() => handleDeleteTeam(team.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-gray-900 px-2"
                      >
                        ×
                      </Button>
                    </div>
                  ))}

                  {/* New Team Form */}
                  {!showNewTeamForm ? (
                    <button
                      onClick={() => setShowNewTeamForm(true)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-gray-900 text-sm font-medium"
                    >
                      + Create Team
                    </button>
                  ) : (
                    <div className="px-4 py-2 border-t border-gray-800">
                      <input
                        type="text"
                        placeholder="Team name..."
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleCreateTeam();
                        }}
                        className="w-full px-2 py-1 bg-gray-900 text-white text-sm rounded border border-gray-700 focus:outline-none focus:border-white"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={handleCreateTeam}
                          size="sm"
                          className="flex-1 bg-white hover:bg-gray-200 text-black"
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => {
                            setShowNewTeamForm(false);
                            setNewTeamName('');
                          }}
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-white hover:bg-gray-900"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {!selectedTeam ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">No Team Selected</h2>
                  <p className="text-gray-400 mb-6">Create a new team or join existing team with key</p>
                </div>

                {/* Join Team Form */}
                <Card className="bg-black border border-gray-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Key className="text-white" size={20} />
                    <h3 className="text-lg font-semibold text-white">Join Team with Key</h3>
                  </div>
                  
                  {!showJoinForm ? (
                    <Button
                      onClick={() => setShowJoinForm(true)}
                      className="w-full bg-white text-black hover:bg-gray-200"
                    >
                      <Key size={16} className="mr-2" />
                      Join Team
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">Team Key</label>
                        <Input
                          placeholder="Enter team key"
                          value={joinKey}
                          onChange={(e) => setJoinKey(e.target.value)}
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-300 mb-1 block">Your Email</label>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          value={joinEmail}
                          onChange={(e) => setJoinEmail(e.target.value)}
                          className="bg-gray-900 text-white border-gray-700"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={handleJoinTeam}
                          className="flex-1 bg-white text-black hover:bg-gray-200"
                        >
                          Join
                        </Button>
                        <Button
                          onClick={() => {
                            setShowJoinForm(false);
                            setJoinKey('');
                            setJoinEmail('');
                          }}
                          variant="outline"
                          className="border-gray-700 text-white hover:bg-gray-900"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Create Team Option */}
                <div className="text-center">
                  <p className="text-gray-400 mb-3">atau</p>
                  <Button
                    onClick={() => {
                      setIsDropdownOpen(true);
                      setShowNewTeamForm(true);
                    }}
                    className="bg-white text-black hover:bg-gray-200"
                  >
                    Create New Team
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}