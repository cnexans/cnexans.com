-- ============================================
-- Database Schema for Carlos Nexans Blog
-- ============================================
-- Complete schema without RLS complexity
-- Tables: comments, contacts, post_likes

-- ============================================
-- 1. COMMENTS TABLE
-- ============================================
-- Stores user comments on blog posts and pages
-- Comments are moderated (is_visible = false by default)

CREATE TABLE IF NOT EXISTS public.comments (
  id SERIAL PRIMARY KEY,
  content_id TEXT NOT NULL,
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  twitter TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  likes INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_comments_content_locale_visible 
  ON public.comments(content_id, locale, is_visible);
  
CREATE INDEX IF NOT EXISTS idx_comments_created_at 
  ON public.comments(created_at DESC);

-- ============================================
-- 2. CONTACTS TABLE
-- ============================================
-- Stores contact form submissions

CREATE TABLE IF NOT EXISTS public.contacts (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  locale TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  response_sent BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at 
  ON public.contacts(created_at DESC);
  
CREATE INDEX IF NOT EXISTS idx_contacts_is_read 
  ON public.contacts(is_read);

CREATE INDEX IF NOT EXISTS idx_contacts_email 
  ON public.contacts(email);

-- ============================================
-- 3. POST LIKES TABLE
-- ============================================
-- Stores likes for blog posts using Supabase Anonymous Auth

CREATE TABLE IF NOT EXISTS public.post_likes (
  id SERIAL PRIMARY KEY,
  content_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_id, user_id),
  CONSTRAINT post_likes_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_post_likes_content_id 
  ON public.post_likes(content_id);
  
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id 
  ON public.post_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_post_likes_content_user 
  ON public.post_likes(content_id, user_id);

-- ============================================
-- 4. FUNCTIONS
-- ============================================

-- Function: Increment comment likes
CREATE OR REPLACE FUNCTION public.increment_comment_likes(comment_id INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.comments
  SET likes = likes + 1, updated_at = NOW()
  WHERE id = comment_id AND is_visible = true;
END;
$$;

-- Function: Get post like count
CREATE OR REPLACE FUNCTION public.get_post_like_count(p_content_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM public.post_likes WHERE content_id = p_content_id);
END;
$$;

-- Function: Check if user has liked a post
CREATE OR REPLACE FUNCTION public.has_user_liked_post(p_content_id TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.post_likes 
    WHERE content_id = p_content_id AND user_id = p_user_id
  );
END;
$$;

-- Function: Toggle post like
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_content_id TEXT, p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_liked BOOLEAN;
  v_count INTEGER;
BEGIN
  -- Check if like exists
  SELECT EXISTS (
    SELECT 1 FROM public.post_likes 
    WHERE content_id = p_content_id AND user_id = p_user_id
  ) INTO v_liked;
  
  IF v_liked THEN
    -- Remove like
    DELETE FROM public.post_likes 
    WHERE content_id = p_content_id AND user_id = p_user_id;
  ELSE
    -- Add like
    INSERT INTO public.post_likes (content_id, user_id)
    VALUES (p_content_id, p_user_id)
    ON CONFLICT (content_id, user_id) DO NOTHING;
  END IF;
  
  -- Get updated count
  SELECT COUNT(*) INTO v_count FROM public.post_likes WHERE content_id = p_content_id;
  
  -- Return the new state
  RETURN jsonb_build_object(
    'liked', NOT v_liked,
    'count', v_count
  );
END;
$$;

-- Function: Get user's liked posts
CREATE OR REPLACE FUNCTION public.get_user_liked_posts(p_user_id UUID)
RETURNS TABLE(content_id TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT post_likes.content_id
  FROM public.post_likes
  WHERE user_id = p_user_id;
END;
$$;

-- ============================================
-- 5. PERMISSIONS (NO RLS)
-- ============================================
-- Grant full permissions to anon and authenticated users
-- We don't use RLS for simplicity

-- Disable RLS on all tables
ALTER TABLE public.comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes DISABLE ROW LEVEL SECURITY;

-- Grant permissions on comments
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.comments TO authenticated;
GRANT USAGE ON SEQUENCE public.comments_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.comments_id_seq TO authenticated;

-- Grant permissions on contacts
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contacts TO authenticated;
GRANT USAGE ON SEQUENCE public.contacts_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.contacts_id_seq TO authenticated;

-- Grant permissions on post_likes
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_likes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.post_likes TO authenticated;
GRANT USAGE ON SEQUENCE public.post_likes_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.post_likes_id_seq TO authenticated;

-- ============================================
-- CONTENT ID CONVENTION
-- ============================================
-- Blog posts: article-{folder}
--   Example: article-no-code-era, article-agi-phase-2
--
-- Guestbook: guestbook
--
-- Other pages: page-{pageName}
--   Example: page-about, page-contact, page-home

-- ============================================
-- COMMON QUERIES
-- ============================================
-- View pending comments:
-- SELECT * FROM public.comments WHERE is_visible = false ORDER BY created_at DESC;
--
-- Approve a comment:
-- UPDATE public.comments SET is_visible = true WHERE id = <comment_id>;
--
-- View unread contacts:
-- SELECT * FROM public.contacts WHERE is_read = false ORDER BY created_at DESC;
--
-- Mark contact as read:
-- UPDATE public.contacts SET is_read = true WHERE id = <contact_id>;
--
-- Get like count for a post:
-- SELECT public.get_post_like_count('article-no-code-era');
