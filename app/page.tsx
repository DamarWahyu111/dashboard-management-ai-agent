'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser } from '@/lib/auth'; // Import auth functions

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const localUser = getCurrentUser();
    if (localUser) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  // Tampilkan loading sederhana biar gak blank putih
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
      Loading Watsonx...
    </div>
  );
}