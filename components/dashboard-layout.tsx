'use client';

import React from "react"

import { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllTeams, createTeam, deleteTeam } from '@/lib/teams';
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

    const newTeam = createTeam(newTeamName, userName);
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

  const currentTeam = teams.find((t) => t.id === selectedTeam);

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar userName={userName} userEmail={userEmail} />

      <div className="flex-1 md:ml-64">
        {/* Top Header with Team Selector */}
        <div className="bg-slate-900 border-b border-slate-700 sticky top-0 z-30">
          <div className="p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">watsonx MindShare</h1>

            {/* Team Selector Dropdown */}
            <div className="relative">
              <Button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-2"
              >
                {currentTeam ? currentTeam.name : 'Select Team'}
                <ChevronDown size={16} />
              </Button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-40">
                  {/* Existing Teams */}
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-slate-700 border-b border-slate-700 last:border-0"
                    >
                      <button
                        onClick={() => {
                          setSelectedTeam(team.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`flex-1 text-left text-sm ${
                          selectedTeam === team.id
                            ? 'text-blue-400 font-semibold'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {team.name}
                      </button>
                      <Button
                        onClick={() => handleDeleteTeam(team.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20 px-2"
                      >
                        ×
                      </Button>
                    </div>
                  ))}

                  {/* New Team Form */}
                  {!showNewTeamForm ? (
                    <button
                      onClick={() => setShowNewTeamForm(true)}
                      className="w-full text-left px-4 py-2 text-blue-400 hover:bg-slate-700 text-sm font-medium"
                    >
                      + Create Team
                    </button>
                  ) : (
                    <div className="px-4 py-2 border-t border-slate-700">
                      <input
                        type="text"
                        placeholder="Team name..."
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleCreateTeam();
                        }}
                        className="w-full px-2 py-1 bg-slate-700 text-white text-sm rounded border border-slate-600 focus:outline-none focus:border-blue-500"
                        autoFocus
                      />
                      <div className="flex gap-2 mt-2">
                        <Button
                          onClick={handleCreateTeam}
                          size="sm"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
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
                          className="flex-1"
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
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-300 mb-2">No Team Selected</h2>
                <p className="text-slate-400 mb-4">Create or select a team to get started</p>
                <Button
                  onClick={() => {
                    setIsDropdownOpen(true);
                    setShowNewTeamForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create First Team
                </Button>
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
