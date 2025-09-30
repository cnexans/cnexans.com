import { supabase } from './supabase';

export interface PostLike {
  id: number;
  content_id: string;
  user_id: string;
  created_at: string;
}

export interface ToggleLikeResponse {
  liked: boolean;
  count: number;
}

/**
 * Ensure user is signed in (anonymously or permanently)
 * Returns the user ID or null if unable to sign in
 */
export async function ensureAuthenticatedUser(): Promise<string | null> {
  try {
    // Check if user is already signed in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      return session.user.id;
    }
    
    // Sign in anonymously
    const { data, error } = await supabase.auth.signInAnonymously();
    
    if (error) {
      console.error('Error signing in anonymously:', error);
      console.error('Make sure Anonymous Sign-In is enabled in your Supabase Dashboard:');
      console.error('Authentication → Providers → Anonymous Sign-In');
      
      // Return null to gracefully handle the error
      // The UI will disable like functionality until this is fixed
      return null;
    }
    
    return data.user?.id || null;
  } catch (error) {
    console.error('Error ensuring authenticated user:', error);
    return null;
  }
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
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_user_liked_post', {
      p_content_id: contentId,
      p_user_id: userId,
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
  userId: string
): Promise<ToggleLikeResponse | null> {
  const { data, error } = await supabase
    .rpc('toggle_post_like', {
      p_content_id: contentId,
      p_user_id: userId,
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
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .rpc('get_user_liked_posts', {
      p_user_id: userId,
    });

  if (error) {
    console.error('Error getting user liked posts:', error);
    return [];
  }

  return data.map((row: { content_id: string }) => row.content_id);
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
