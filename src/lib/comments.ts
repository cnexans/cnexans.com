import { supabase } from './supabase';

export interface Comment {
  id: number;
  content_id: string;
  locale: string;
  name: string;
  message: string;
  twitter?: string | null;
  email?: string | null;
  created_at: string;
  updated_at: string;
  likes: number;
  is_visible: boolean;
}

export interface CreateCommentData {
  content_id: string;
  locale: string;
  name: string;
  message: string;
  twitter?: string;
  email?: string;
  is_visible?: boolean;
}

/**
 * Fetch approved comments for a specific content and locale
 */
export async function getComments(
  contentId: string,
  locale: string
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('content_id', contentId)
    .eq('locale', locale)
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }

  return data || [];
}

/**
 * Add a new comment (will be pending approval by default)
 */
export async function addComment(
  commentData: CreateCommentData
): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .insert([commentData]);

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

/**
 * Increment the likes count for a comment
 */
export async function likeComment(commentId: number): Promise<void> {
  const { error } = await supabase
    .rpc('increment_comment_likes', {
      comment_id: commentId,
    });

  if (error) {
    console.error('Error liking comment:', error);
    throw error;
  }
}
