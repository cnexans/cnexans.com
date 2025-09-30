"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPostLikeCount,
  getUserLikedPosts,
  togglePostLike as togglePostLikeAPI,
  ensureAuthenticatedUser,
} from "@/lib/post-likes";

export function usePostLikes() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
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
      
      setUserId(id);

      // Load user's liked posts from Supabase
      const likedPosts = await getUserLikedPosts(id);
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

  const toggleLike = useCallback(async (contentId: string) => {
    if (!userId || isLoading) return;

    const wasLiked = userLikes.has(contentId);
    
    // Optimistic update
    setUserLikes((prev) => {
      const newSet = new Set(prev);
      if (wasLiked) {
        newSet.delete(contentId);
      } else {
        newSet.add(contentId);
      }
      return newSet;
    });
    
    setLikes((prev) => ({
      ...prev,
      [contentId]: Math.max((prev[contentId] || 0) + (wasLiked ? -1 : 1), 0),
    }));

    // Call API to toggle like
    const result = await togglePostLikeAPI(contentId, userId);
    
    if (result) {
      // Update with the server response
      setLikes((prev) => ({
        ...prev,
        [contentId]: result.count,
      }));
      
      setUserLikes((prev) => {
        const newSet = new Set(prev);
        if (result.liked) {
          newSet.add(contentId);
        } else {
          newSet.delete(contentId);
        }
        return newSet;
      });
    } else {
      // Revert optimistic update on error
      setUserLikes((prev) => {
        const newSet = new Set(prev);
        if (wasLiked) {
          newSet.add(contentId);
        } else {
          newSet.delete(contentId);
        }
        return newSet;
      });
      
      setLikes((prev) => ({
        ...prev,
        [contentId]: Math.max((prev[contentId] || 0) + (wasLiked ? 1 : -1), 0),
      }));
    }
  }, [userId, userLikes, isLoading]);

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
    toggleLike,
    getLikeCount,
    isLiked,
    isLoading,
  };
}
