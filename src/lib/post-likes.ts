import { supabase } from './supabase';

export interface PostLike {
  id: number;
  content_id: string;
  user_fingerprint: string;
  created_at: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  count: number;
}

/**
 * Generate a simple browser fingerprint for anonymous user tracking
 * This is a basic implementation - you could use a library like fingerprintjs for more robustness
 */
export function generateUserFingerprint(): string {
  // Check if we already have a fingerprint in localStorage
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('user-fingerprint');
    if (stored) return stored;
    
    // Generate a new fingerprint
    const fingerprint = `fp_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('user-fingerprint', fingerprint);
    return fingerprint;
  }
  
  // Fallback for SSR
  return 'anonymous';
}

/**
 * Get the like count for a specific content
 */
export async function getPostLikeCount(contentId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_post_like_count', {
      p_content_id: contentId,
    });

  if (error) {
    console.error('Error getting post like count:', error);
    return 0;
  }

  return data || 0;
}

/**
 * Check if the current user has liked a post
 */
export async function hasUserLikedPost(
  contentId: string,
  userFingerprint: string
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_user_liked_post', {
      p_content_id: contentId,
      p_user_fingerprint: userFingerprint,
    });

  if (error) {
    console.error('Error checking if user liked post:', error);
    return false;
  }

  return data || false;
}

/**
 * Toggle like for a post (add if not liked, remove if already liked)
 */
export async function togglePostLike(
  contentId: string,
  userFingerprint: string
): Promise<ToggleLikeResponse | null> {
  const { data, error } = await supabase
    .rpc('toggle_post_like', {
      p_content_id: contentId,
      p_user_fingerprint: userFingerprint,
    });

  if (error) {
    console.error('Error toggling post like:', error);
    return null;
  }

  return data as ToggleLikeResponse;
}

/**
 * Get all content IDs that a user has liked
 */
export async function getUserLikedPosts(
  userFingerprint: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from('post_likes')
    .select('content_id')
    .eq('user_fingerprint', userFingerprint);

  if (error) {
    console.error('Error getting user liked posts:', error);
    return [];
  }

  return data.map((row) => row.content_id);
}

/**
 * Get like counts for multiple posts at once
 */
export async function getMultiplePostLikeCounts(
  contentIds: string[]
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('post_likes')
    .select('content_id')
    .in('content_id', contentIds);

  if (error) {
    console.error('Error getting multiple post like counts:', error);
    return {};
  }

  // Count likes per content_id
  const counts: Record<string, number> = {};
  contentIds.forEach((id) => {
    counts[id] = 0;
  });
  
  data.forEach((row) => {
    counts[row.content_id] = (counts[row.content_id] || 0) + 1;
  });

  return counts;
}
