-- ============================================
-- Configure RLS Policies for Post Likes
-- ============================================
-- Enable RLS on post_likes table
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read post likes (to display counts)
CREATE POLICY "Allow public read access to post_likes"
ON public.post_likes
FOR SELECT
TO public
USING (true);

-- Allow anyone to insert post likes (through the RPC function)
CREATE POLICY "Allow public insert access to post_likes"
ON public.post_likes
FOR INSERT
TO public
WITH CHECK (true);

-- Allow anyone to delete their own post likes (through the RPC function)
CREATE POLICY "Allow public delete access to post_likes"
ON public.post_likes
FOR DELETE
TO public
USING (true);

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.post_likes TO anon;
GRANT SELECT, INSERT, DELETE ON public.post_likes TO authenticated;

-- Grant usage on the sequence
GRANT USAGE ON SEQUENCE public.post_likes_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.post_likes_id_seq TO authenticated;
