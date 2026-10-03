import { supabase } from './supabase';

export interface LikeResponse {
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
 * Like a post as the current user. Likes can't be removed: the database only
 * allows reading counts and adding likes (see .claude/skills/supabase-schema).
 */
export async function likePost(contentId: string): Promise<LikeResponse | null> {
  const { data, error } = await supabase.rpc('like_post', {
    p_content_id: contentId,
  });

  if (error) {
    console.error('Error liking post:', error);
    return null;
  }

  return data as LikeResponse;
}

/**
 * Get all content IDs the current user has liked
 */
export async function getMyLikedPosts(): Promise<string[]> {
  const { data, error } = await supabase.rpc('get_my_liked_posts');

  if (error) {
    console.error('Error getting liked posts:', error);
    return [];
  }

  return data.map((row: { content_id: string }) => row.content_id);
}
