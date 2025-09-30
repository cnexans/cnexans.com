ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies (for clean slate)
DROP POLICY IF EXISTS "anon_select_approved_comments" ON public.comments;
DROP POLICY IF EXISTS "anon_insert_pending_comments" ON public.comments;
DROP POLICY IF EXISTS "public_select_approved_comments" ON public.comments;
DROP POLICY IF EXISTS "public_insert_pending_comments" ON public.comments;
DROP POLICY IF EXISTS "service_role_all_access" ON public.comments;
