-- ============================================
-- Fix Security Issues for Post Likes Functions
-- ============================================
-- Update functions to set search_path for security

-- Drop and recreate get_post_like_count with search_path set
DROP FUNCTION IF EXISTS public.get_post_like_count(TEXT);
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

-- Drop and recreate has_user_liked_post with search_path set
DROP FUNCTION IF EXISTS public.has_user_liked_post(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.has_user_liked_post(p_content_id TEXT, p_user_fingerprint TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.post_likes 
    WHERE content_id = p_content_id AND user_fingerprint = p_user_fingerprint
  );
END;
$$;

-- Drop and recreate toggle_post_like with search_path set
DROP FUNCTION IF EXISTS public.toggle_post_like(TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.toggle_post_like(p_content_id TEXT, p_user_fingerprint TEXT)
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
$$;
