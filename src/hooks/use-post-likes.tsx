"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPostLikeCount,
  getMyLikedPosts,
  likePost,
  ensureAuthenticatedUser,
} from "@/lib/post-likes";

export function usePostLikes() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user (sign in anonymously if needed) and load user's liked posts
  useEffect(() => {
    const initializeUser = async () => {
      const id = await ensureAuthenticatedUser();
      
      if (!id) {
        console.error('Unable to authenticate user');
        setIsLoading(false);
        return;
      }
      
      setIsAuthenticated(true);

      // Load user's liked posts from Supabase
      const likedPosts = await getMyLikedPosts();
      setUserLikes(new Set(likedPosts));
      setIsLoading(false);
    };

    initializeUser();
  }, []);

  // Load like count for a specific post when needed
  const loadLikeCount = useCallback(async (contentId: string) => {
    if (likes[contentId] !== undefined) return; // Already loaded
    
    const count = await getPostLikeCount(contentId);
    setLikes((prev) => ({
      ...prev,
      [contentId]: count,
    }));
  }, [likes]);

  // Likes can only be added, never removed
  const like = useCallback(async (contentId: string) => {
    if (!isAuthenticated || isLoading || userLikes.has(contentId)) return;

    // Optimistic update
    setUserLikes((prev) => new Set(prev).add(contentId));
    setLikes((prev) => ({ ...prev, [contentId]: (prev[contentId] || 0) + 1 }));

    const result = await likePost(contentId);

    if (result) {
      setLikes((prev) => ({ ...prev, [contentId]: result.count }));
    } else {
      // Revert optimistic update on error
      setUserLikes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(contentId);
        return newSet;
      });
      setLikes((prev) => ({ ...prev, [contentId]: Math.max((prev[contentId] || 1) - 1, 0) }));
    }
  }, [isAuthenticated, userLikes, isLoading]);

  const getLikeCount = useCallback((contentId: string): number => {
    // Load count from Supabase if not already loaded
    if (likes[contentId] === undefined && !isLoading) {
      loadLikeCount(contentId);
    }
    return likes[contentId] || 0;
  }, [likes, isLoading, loadLikeCount]);

  const isLiked = useCallback((contentId: string): boolean => {
    return userLikes.has(contentId);
  }, [userLikes]);

  return {
    like,
    getLikeCount,
    isLiked,
    isLoading,
  };
}
