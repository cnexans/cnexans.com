"use client";

import { useState, useEffect } from "react";

export function usePostLikes() {
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  // Cargar likes del localStorage al montar el componente
  useEffect(() => {
    const storedLikes = localStorage.getItem('post-likes');
    const storedUserLikes = localStorage.getItem('user-likes');
    
    if (storedLikes) {
      setLikes(JSON.parse(storedLikes));
    }
    
    if (storedUserLikes) {
      setUserLikes(new Set(JSON.parse(storedUserLikes)));
    }
  }, []);

  // Guardar likes en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem('post-likes', JSON.stringify(likes));
  }, [likes]);

  useEffect(() => {
    localStorage.setItem('user-likes', JSON.stringify(Array.from(userLikes)));
  }, [userLikes]);

  const toggleLike = (postSlug: string) => {
    const isLiked = userLikes.has(postSlug);
    
    if (isLiked) {
      // Quitar like
      setUserLikes(prev => {
        const newSet = new Set(prev);
        newSet.delete(postSlug);
        return newSet;
      });
      
      setLikes(prev => ({
        ...prev,
        [postSlug]: Math.max((prev[postSlug] || 0) - 1, 0)
      }));
    } else {
      // Agregar like
      setUserLikes(prev => new Set(prev).add(postSlug));
      
      setLikes(prev => ({
        ...prev,
        [postSlug]: (prev[postSlug] || 0) + 1
      }));
    }
  };

  const getLikeCount = (postSlug: string): number => {
    return likes[postSlug] || 0;
  };

  const isLiked = (postSlug: string): boolean => {
    return userLikes.has(postSlug);
  };

  return {
    toggleLike,
    getLikeCount,
    isLiked
  };
}
