-- ============================================
-- Create Comments Table in Public Schema
-- ============================================
-- Simple approach: Use public schema without RLS complexity
-- This creates the table structure without role/permission configuration

-- Create comments table in public schema
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

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_public_comments_content_locale_visible 
  ON public.comments(content_id, locale, is_visible);
  
CREATE INDEX IF NOT EXISTS idx_public_comments_created_at 
  ON public.comments(created_at DESC);

-- Create function to increment comment likes
CREATE OR REPLACE FUNCTION public.increment_comment_likes(comment_id INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.comments
  SET likes = likes + 1, updated_at = NOW()
  WHERE id = comment_id AND is_visible = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Content ID Convention:
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
-- Manual Moderation Commands:
-- ============================================
-- View pending comments:
-- SELECT * FROM public.comments WHERE is_visible = false ORDER BY created_at DESC;
--
-- Approve a comment:
-- UPDATE public.comments SET is_visible = true WHERE id = <comment_id>;
--
-- Hide/reject a comment:
-- UPDATE public.comments SET is_visible = false WHERE id = <comment_id>;
--
-- ============================================
-- Verification:
-- ============================================
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name = 'comments';
--
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns 
-- WHERE table_schema = 'public' AND table_name = 'comments'
-- ORDER BY ordinal_position;
