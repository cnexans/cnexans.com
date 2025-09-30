# 🚀 Comments System Database Setup

## 📋 Migration Files (Run in Order)

```
src/db/
├── 000_create-comments-public-schema.sql  ← Run FIRST
└── 001_configure-rls-policies.sql         ← Run SECOND
```

---

## ✅ Step 1: Create Table

Run `000_create-comments-public-schema.sql` in Supabase SQL Editor.

Creates:
- `public.comments` table
- Indexes for performance
- `increment_comment_likes()` function

---

## ✅ Step 2: Configure Security

Run `001_configure-rls-policies.sql` in Supabase SQL Editor.

Creates 3 RLS policies:
1. **SELECT**: Anyone (including unauthenticated) can read `is_visible = true`
2. **INSERT**: Anyone (including unauthenticated) can insert `is_visible = false`
3. **ALL**: Service role has full access for admin

---

## 🧪 Test

```sql
-- Test insert
INSERT INTO public.comments (content_id, locale, name, message)
VALUES ('test', 'en', 'Test', 'Test message');

-- Approve it
UPDATE public.comments SET is_visible = true WHERE content_id = 'test';

-- Read it
SELECT * FROM public.comments WHERE is_visible = true;
```

---

## 📊 Manage Comments

```sql
-- View pending
SELECT * FROM public.comments WHERE is_visible = false ORDER BY created_at DESC;

-- Approve
UPDATE public.comments SET is_visible = true WHERE id = 1;

-- Delete spam
DELETE FROM public.comments WHERE id = 1;
```

---

## 🔒 Security

✅ Anyone can read approved comments  
✅ Anyone can submit comments (pending approval)  
❌ Public cannot update/delete  
✅ Service role has full access

All new comments default to `is_visible = false` and require manual approval.
