'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthForm = ({ onAuth }: { onAuth: (userId: string, username: string) => void }) => {
  const [step, setStep] = useState<'generate' | 'username'>('generate');
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(true);

  // Generate 10-digit ID automatically on mount
  useEffect(() => {
    generateUserId();
  }, []);

  const generateUserId = () => {
    setIsGenerating(true);
    const digits = '0123456789';
    let id = '';
    
    // Simulate generation process for dramatic effect
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < 10) {
        id += digits[Math.floor(Math.random() * digits.length)];
        setUserId(id);
        charIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'generate') {
      if (userId.length !== 10 || !/^\d+$/.test(userId)) {
        setError('Invalid ID format');
        return;
      }
      setStep('username');
      setError('');
    } else {
      if (!username.trim() || username.length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }
      if (username.length > 20) {
        setError('Username must be less than 20 characters');
        return;
      }
      onAuth(userId, username);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 bg-opacity-80 p-8 rounded-2xl backdrop-blur-md border border-cyan-500 border-opacity-30 shadow-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {step === 'generate' ? (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center space-y-6"
            >
              <div>
                <h2 className="text-2xl font-bold text-cyan-400 mb-2 tracking-wider">
                  SECURE ID GENERATED
                </h2>
                <p className="text-gray-400 text-sm">
                  Your unique 10-digit access ID has been created
                </p>
              </div>

              <div className="relative">
                <motion.div 
                  className="text-3xl font-mono text-center bg-black bg-opacity-50 p-4 rounded-lg border border-cyan-500 border-opacity-50 tracking-[0.3em]"
                  animate={isGenerating ? { opacity: [0.5, 1, 0.5] } : {}}
                  transition={{ duration: 0.5, repeat: isGenerating ? Infinity : 0 }}
                >
                  {userId.padEnd(10, '•')}
                </motion.div>
                {isGenerating && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={generateUserId}
                  className="flex-1 bg-gray-800 text-cyan-400 py-3 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300 border border-cyan-500 border-opacity-30 hover:border-opacity-60"
                >
                  Regenerate
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 px-4 rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                >
                  Continue →
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="username"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-cyan-400 mb-2 tracking-wider">
                  CHOOSE YOUR IDENTITY
                </h2>
                <p className="text-gray-400 text-sm">
                  This name will be visible in the forum
                </p>
              </div>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (3-20 characters)"
                className="w-full bg-black bg-opacity-50 border border-cyan-500 border-opacity-50 text-cyan-300 placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all duration-300"
                minLength={3}
                maxLength={20}
              />

              {error && (
                <motion.p 
                  className="text-red-400 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-bold py-3 px-4 rounded-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
              >
                Enter Forum
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <motion.div 
          className="text-gray-500 text-xs text-center mt-6 p-4 bg-gray-800 bg-opacity-30 rounded-lg border border-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="font-semibold text-cyan-400 mb-1">⚠️ ANONYMITY DISCLAIMER</p>
          <p>
            This forum is completely anonymous and unmoderated. All content is user-generated. 
            Exercise caution and participate at your own risk. Your ID is your only access key.
          </p>
        </motion.div>
      </form>
    </motion.div>
  );
};