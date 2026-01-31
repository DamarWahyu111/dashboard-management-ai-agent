'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  BarChart3,
  Calendar,
  LogOut,
  Users,
  FileText,
  Menu,
  X,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/auth';

interface SidebarProps {
  userName: string;
  userEmail: string;
}

export function Sidebar({ userName, userEmail }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleNavClick = (href: string, id: string) => {
    setIsOpen(false);
    
    if (pathname === '/dashboard') {
      if (id === 'calendar') {
        // Navigate to calendar section in overview
        window.location.hash = 'calendar';
        // Trigger custom event for dashboard to handle
        window.dispatchEvent(new CustomEvent('navigateToCalendar'));
      } else if (id === 'dashboard') {
        window.location.hash = '';
        window.dispatchEvent(new CustomEvent('navigateToTab', { detail: 'overview' }));
      } else {
        window.location.hash = id;
        window.dispatchEvent(new CustomEvent('navigateToTab', { detail: id }));
      }
    }
  };

  const navItems = [
    { label: 'Dashboard', icon: BarChart3, href: '#dashboard', id: 'dashboard' },
    { label: 'Charts', icon: BarChart3, href: '#charts', id: 'charts' },
    { label: 'Statistics', icon: FileText, href: '#statistics', id: 'statistics' },
    { label: 'Calendar', icon: Calendar, href: '#calendar', id: 'calendar' },
  ];

  const settingsItems = [
    { label: 'Settings', icon: Settings, href: '#settings', id: 'settings' },
    { label: 'Support', icon: MessageSquare, href: '#support', id: 'support' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="text-white"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 border-r border-slate-700 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-white">watsonx</h1>
          <p className="text-xs text-slate-400 mt-1">MindShare</p>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userName}</p>
              <p className="text-xs text-slate-400 truncate">{userEmail}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = typeof window !== 'undefined' && 
              (item.id === 'calendar' ? window.location.hash === '#calendar' : 
               window.location.hash === `#${item.id}` || 
               (item.id === 'dashboard' && !window.location.hash));
            
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href, item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Button
            onClick={handleLogout}
            className="w-full justify-start gap-3 px-4 bg-red-600 hover:bg-red-700"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
