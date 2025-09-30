-- ============================================
-- Create Post Likes Table
-- ============================================
-- This table stores likes for blog posts and other content
-- Each like is tracked by content_id and user_fingerprint

-- Create post_likes table
CREATE TABLE IF NOT EXISTS public.post_likes (
  id SERIAL PRIMARY KEY,
  content_id TEXT NOT NULL,
  user_fingerprint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_id, user_fingerprint)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_post_likes_content_id 
  ON public.post_likes(content_id);
  
CREATE INDEX IF NOT EXISTS idx_post_likes_user_fingerprint 
  ON public.post_likes(user_fingerprint);

CREATE INDEX IF NOT EXISTS idx_post_likes_content_user 
  ON public.post_likes(content_id, user_fingerprint);

-- Create function to get like count for a post
CREATE OR REPLACE FUNCTION public.get_post_like_count(p_content_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.post_likes WHERE content_id = p_content_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has liked a post
CREATE OR REPLACE FUNCTION public.has_user_liked_post(p_content_id TEXT, p_user_fingerprint TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.post_likes 
    WHERE content_id = p_content_id AND user_fingerprint = p_user_fingerprint
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to toggle like (add or remove)
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_content_id TEXT, p_user_fingerprint TEXT)
RETURNS JSONB AS $$
DECLARE
  v_liked BOOLEAN;
  v_count INTEGER;
BEGIN
  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM public.post_likes 
    WHERE content_id = p_content_id AND user_fingerprint = p_user_fingerprint
  ) INTO v_liked;
  
  IF v_liked THEN
    -- Remove like
    DELETE FROM public.post_likes 
    WHERE content_id = p_content_id AND user_fingerprint = p_user_fingerprint;
  ELSE
    -- Add like
    INSERT INTO public.post_likes (content_id, user_fingerprint)
    VALUES (p_content_id, p_user_fingerprint)
    ON CONFLICT (content_id, user_fingerprint) DO NOTHING;
  END IF;
  
  -- Get updated count
  SELECT COUNT(*) INTO v_count FROM public.post_likes WHERE content_id = p_content_id;
  
  -- Return the new state
  RETURN jsonb_build_object(
    'liked', NOT v_liked,
    'count', v_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Content ID Convention (same as comments):
-- ============================================
-- Blog posts: article-{folder}
--   Example: article-no-code-era, article-agi-phase-2
--
-- Guestbook: guestbook
--
-- Other pages: page-{pageName}
--   Example: page-about, page-contact, page-home
--
-- ============================================
-- Query Examples:
-- ============================================
-- Get like count for a post:
-- SELECT public.get_post_like_count('article-no-code-era');
--
-- Check if user liked a post:
-- SELECT public.has_user_liked_post('article-no-code-era', 'user123');
--
-- Toggle like:
-- SELECT public.toggle_post_like('article-no-code-era', 'user123');
--
-- Get all likes for a post:
-- SELECT * FROM public.post_likes WHERE content_id = 'article-no-code-era';
