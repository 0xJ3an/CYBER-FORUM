'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// CSS for performance optimization
const matrixStyles = `
  @keyframes matrix-flicker {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
  }
  
  .matrix-char {
    animation: matrix-flicker 2s infinite;
    will-change: opacity;
  }
  
  .matrix-char:nth-child(3n) {
    animation-delay: 0.5s;
  }
  
  .matrix-char:nth-child(5n) {
    animation-delay: 1s;
  }
`;

export const EncryptionAnimation = ({ onComplete }: { onComplete?: () => void }) => {
  const [matrix, setMatrix] = useState<string[][]>([]);
  const [showMessage, setShowMessage] = useState(true);
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  
  useEffect(() => {
    // Optimized for performance - reduce matrix density
    const chars = '01'; // Simplified character set for better performance
    const cellSize = 24; // Larger cells = fewer elements
    const rows = Math.min(Math.floor(window.innerHeight / cellSize), 30); // Max 30 rows
    const cols = Math.min(Math.floor(window.innerWidth / cellSize), 50); // Max 50 columns
    
    let frameCount = 0;
    let progressInterval: NodeJS.Timeout;
    
    const createMatrix = () => {
      const newMatrix = [];
      for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < cols; j++) {
          // Simplified approach - always generate new characters for better performance
          row.push(chars[Math.floor(Math.random() * chars.length)]);
        }
        newMatrix.push(row);
      }
      setMatrix(newMatrix);
    };

    // Initial matrix creation
    createMatrix();
    
    // Update matrix less frequently
    const matrixInterval = setInterval(createMatrix, 300); // Much slower update rate for better performance
    
    // Progress bar updates
    progressInterval = setInterval(() => {
      setEncryptionProgress(prev => {
        const newProgress = prev + 2;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 100);
    
    // Hide message after 2 seconds
    const messageTimer = setTimeout(() => {
      setShowMessage(false);
    }, 2000);
    
    // Complete animation after 2.5 seconds (even faster completion)
    const completeTimer = setTimeout(() => {
      clearInterval(matrixInterval);
      clearInterval(progressInterval);
      if (onComplete) onComplete();
    }, 2500);
    
    return () => {
      clearInterval(matrixInterval);
      clearInterval(progressInterval);
      clearTimeout(messageTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]); // Removed matrix dependency to prevent infinite loop

  return (
    <>
      <style>{matrixStyles}</style>
      <motion.div 
        className="fixed inset-0 bg-black pointer-events-none z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
      {/* Optimized Matrix Background - Single canvas-like element */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="grid w-full h-full"
          style={{ 
            gridTemplateColumns: `repeat(${matrix[0]?.length || 50}, 1fr)`,
            gridTemplateRows: `repeat(${matrix.length}, 1fr)`
          }}
        >
          {matrix.flat().map((char, index) => (
            <span
              key={index}
              className="text-green-400 font-mono text-center inline-block matrix-char"
              style={{ 
                fontSize: '14px',
                color: Math.random() > 0.95 ? '#10b981' : '#065f46',
                lineHeight: '1',
                filter: 'blur(0.5px)'
              }}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
      
      {/* Encryption Message */}
      {showMessage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-cyan-400 mb-4"
              style={{
                textShadow: '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)',
                fontFamily: 'monospace'
              }}
              animate={{ 
                textShadow: [
                  '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)',
                  '0 0 30px rgba(0, 255, 255, 1), 0 0 60px rgba(0, 255, 255, 0.6)',
                  '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ENCRYPTING DATA
            </motion.h1>
            <motion.div 
              className="w-64 h-2 bg-gray-800 rounded-full mx-auto mb-4 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${encryptionProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.p 
              className="text-cyan-300 text-sm opacity-70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 1 }}
            >
              Securing your anonymous connection...
            </motion.p>
          </div>
        </motion.div>
      )}
      
      {/* Cybersecurity Icons */}
      <div className="absolute top-4 left-4 text-cyan-400 opacity-30">
        <div className="text-2xl mb-2">🔒</div>
        <div className="text-xl mb-2">🛡️</div>
        <div className="text-lg">⚡</div>
      </div>
      
      <div className="absolute top-4 right-4 text-cyan-400 opacity-30">
        <div className="text-lg mb-2">💻</div>
        <div className="text-xl mb-2">🔐</div>
        <div className="text-2xl">🚨</div>
      </div>
      </motion.div>
    </>
  );
};