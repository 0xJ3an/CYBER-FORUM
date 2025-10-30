'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Post {
  _id: string;
  title: string;
  content: string;
  authorId: string;
  username: string;
  createdAt: string;
  replies: Reply[];
}

interface Reply {
  _id: string;
  content: string;
  authorId: string;
  username: string;
  createdAt: string;
}

export const ForumPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ userId: string; username: string } | null>(null);

  // Get user from localStorage or session
  useEffect(() => {
    const userData = localStorage.getItem('forumUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to load posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Listen for post creation events
    const handlePostCreated = () => {
      fetchPosts();
    };

    window.addEventListener('postCreated', handlePostCreated);
    return () => window.removeEventListener('postCreated', handlePostCreated);
  }, []);

  const handleReply = async (postId: string, content: string) => {
    if (!user) {
      alert('You must be logged in to reply');
      return;
    }

    if (content.length > 1000) {
      alert('Reply too long (max 1000 characters)');
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
          authorId: user.userId,
          username: user.username,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create reply');
      }

      // Refresh posts
      const updatedResponse = await fetch('/api/posts');
      if (updatedResponse.ok) {
        const data = await updatedResponse.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error replying:', error);
      alert('Failed to create reply');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-cyan-400 text-lg"
        >
          Loading posts...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-lg"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 bg-gradient-to-br from-gray-900 to-black rounded-xl p-8 border border-cyan-500/30 shadow-2xl"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
          Welcome to Cyber Forum
        </h3>
        <p className="text-gray-400 text-lg">No posts yet. Be the first to share your cybersecurity knowledge!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <motion.div
          key={post._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-cyan-500/30 shadow-2xl backdrop-blur-sm hover:border-cyan-500/50 transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {post.title}
            </h3>
            <div className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
          
          <p className="text-gray-300 mb-6 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                {post.username.charAt(0).toUpperCase()}
              </div>
              <span className="font-mono">{post.username}</span>
            </div>
            <span>{new Date(post.createdAt).toLocaleTimeString()}</span>
          </div>

          {post.replies.length > 0 && (
            <div className="mb-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold flex items-center gap-2"
                onClick={() => document.getElementById(`replies-${post._id}`)?.classList.toggle('hidden')}
              >
                <span>💬</span>
                {post.replies.length} {post.replies.length === 1 ? 'reply' : 'replies'}
                <span className="transform transition-transform" style={{
                  transform: document.getElementById(`replies-${post._id}`)?.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)'
                }}>▼</span>
              </motion.button>
              
              <motion.div
                id={`replies-${post._id}`}
                className="hidden mt-4 space-y-3 ml-4"
                initial={false}
                animate={{
                  height: document.getElementById(`replies-${post._id}`)?.classList.contains('hidden') ? 0 : 'auto'
                }}
                transition={{ duration: 0.3 }}
              >
                {post.replies.map((reply) => (
                  <motion.div
                    key={reply._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-gray-800/50 rounded-lg p-4 border border-cyan-500/20"
                  >
                    <p className="text-gray-300 mb-2 leading-relaxed">{reply.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                          {reply.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-mono">{reply.username}</span>
                      </div>
                      <span>{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}

          {user && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const content = formData.get('content') as string;
                if (content.trim()) {
                  handleReply(post._id, content);
                  (e.target as HTMLFormElement).reset();
                }
              }}
              className="mt-6 pt-4 border-t border-cyan-500/20"
            >
              <div className="space-y-3">
                <textarea
                  name="content"
                  placeholder="Share your thoughts..."
                  className="w-full bg-gray-800/50 text-white border border-cyan-500/30 rounded-lg p-3 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 backdrop-blur-sm resize-none"
                  rows={3}
                  maxLength={1000}
                  required
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Max 1000 characters</span>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-500 transition-all duration-300 shadow-lg"
                  >
                    Reply
                  </motion.button>
                </div>
              </div>
            </motion.form>
          )}
        </motion.div>
      ))}
    </div>
  );
};
