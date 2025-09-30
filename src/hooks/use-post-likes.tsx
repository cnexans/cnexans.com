"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPostLikeCount,
  getUserLikedPosts,
  togglePostLike as togglePostLikeAPI,
  generateUserFingerprint,
} from "@/lib/post-likes";

export function usePostLikes() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userFingerprint, setUserFingerprint] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user fingerprint and load user's liked posts
  useEffect(() => {
    const fingerprint = generateUserFingerprint();
    setUserFingerprint(fingerprint);

    // Load user's liked posts from Supabase
    getUserLikedPosts(fingerprint).then((likedPosts) => {
      setUserLikes(new Set(likedPosts));
      setIsLoading(false);
    });
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
    if (!userFingerprint || isLoading) return;

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
    const result = await togglePostLikeAPI(contentId, userFingerprint);
    
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
  }, [userFingerprint, userLikes, isLoading]);

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
