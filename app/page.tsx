'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EncryptionAnimation } from '@/components/EncryptionAnimation';
import { AuthForm } from '@/components/AuthForm';
import { CreatePost } from '@/components/CreatePost';
import { ForumPost } from '@/components/ForumPost';

interface User {
  userId: string;
  username: string;
}

function generateUserId(): string {
  const digits = '0123456789';
  let id = '';
  for (let i = 0; i < 10; i++) {
    id += digits[Math.floor(Math.random() * digits.length)];
  }
  return id;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState<'encrypting' | 'entering' | 'authenticated'>('encrypting');
  const [showEncryption, setShowEncryption] = useState(true);

  const handleEncryptionComplete = () => {
    setTimeout(() => {
      setShowEncryption(false);
      setAuthStep('entering');
    }, 1000);
  };

  const handleAuth = async (userId: string, username: string) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, username }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication error');
      }

      const userData = await response.json();
      setUser(userData);
      setAuthStep('authenticated');
    } catch (error) {
      console.error('Authentication error:', error);
      alert(error instanceof Error ? error.message : 'Authentication error');
    }
  };

  if (showEncryption && authStep === 'encrypting') {
    return (
      <div className="min-h-screen bg-black">
        <EncryptionAnimation onComplete={handleEncryptionComplete} />
      </div>
    );
  }

  if (!user && authStep === 'entering') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 w-full max-w-md">
          <div className="text-center mb-8">
            <motion.h1 
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              CYBER FORUM
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-lg mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Anonymous • Secure • Unmoderated
            </motion.p>
            <motion.p 
              className="text-gray-500 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Created by <span className="text-cyan-400 font-mono">J3AN</span> • UDLA
            </motion.p>
          </div>
          <AuthForm onAuth={handleAuth} />
        </div>
      </div>
    );
  }

  if (user && authStep === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100">
        <div className="container mx-auto px-4 py-8">
          <motion.header 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  CYBER FORUM
                </h1>
                <p className="text-gray-400 text-sm mt-1">Anonymous Cybersecurity Discussion</p>
              </div>
              <div className="text-right bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-cyan-500 border-opacity-30">
                <p className="text-cyan-300 font-semibold">{user.username}</p>
                <p className="text-gray-500 text-xs font-mono">ID: {user.userId}</p>
              </div>
            </div>
            
            <motion.div 
              className="bg-yellow-900 bg-opacity-20 border border-yellow-600 border-opacity-50 p-4 rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <p className="text-yellow-400 text-center text-sm">
                ⚠️ This forum is completely anonymous and unmoderated. All posts are permanent. 
                Exercise extreme caution and participate at your own risk.
              </p>
            </motion.div>
            
            <motion.div 
              className="mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <p className="text-gray-500 text-xs">
                Created by <span className="text-cyan-400 font-mono">J3AN</span> • UDLA
              </p>
            </motion.div>
          </motion.header>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <CreatePost userId={user.userId} username={user.username} />
            <div className="mt-8 space-y-6">
              <ForumPost />
            </div>
          </motion.main>
        </div>
      </div>
    );
  }

  return null;
}
