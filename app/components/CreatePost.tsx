'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface CreatePostProps {
  userId: string;
  username: string;
}

export const CreatePost = ({ userId, username }: CreatePostProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          authorId: userId,
          username,
        }),
      });

      if (!response.ok) {
        throw new Error('Error creating post');
      }

      setTitle('');
      setContent('');
      setShowForm(false);
      
      // Dispatch custom event to refresh posts
      window.dispatchEvent(new CustomEvent('postCreated'));
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 mb-8 border border-cyan-500/30 shadow-2xl backdrop-blur-sm"
    >
      {!showForm ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
            Share Your Knowledge
          </h2>
          <p className="text-gray-400 mb-6">Contribute to the cybersecurity community</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Create New Post
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Create New Post
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full bg-gray-800/50 text-white border border-cyan-500/30 rounded-lg p-4 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm"
                maxLength={100}
                required
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {title.length}/100
              </div>
            </div>
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your cybersecurity insights, questions, or experiences..."
                className="w-full bg-gray-800/50 text-white border border-cyan-500/30 rounded-lg p-4 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm resize-none"
                rows={6}
                required
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {content.length} characters
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !title.trim() || !content.trim()}
                className={`flex-1 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold 
                  ${isLoading || !title.trim() || !content.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:from-cyan-400 hover:to-purple-500 transform hover:scale-105'} 
                  transition-all duration-300 shadow-lg`}
              >
                {isLoading ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </motion.div>
  );
};
