# Comments System Setup Guide

This guide will help you set up the unified comments system for your website.

## Overview

The comments system allows users to leave comments on:
- Blog posts (identified by `article-{folder}`)
- Guestbook (identified by `guestbook`)
- Any other page (identified by `page-{pageName}`)

All comments require **manual approval** before being visible to the public.

## Step 1: Environment Variables

Create a `.env.local` file in the project root with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under **API**.

## Step 2: Run the Database Schema

1. Open your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy the contents of `/src/db/000_comments-schema.sql`
4. Paste and execute the SQL script

This will:
- Create the `home` schema
- Create the `comments` table
- Set up indexes for performance
- Configure Row Level Security (RLS) policies
- Create the `increment_comment_likes` function

## Step 3: Verify Database Setup

After running the SQL script, verify that everything was created correctly:

```sql
-- Check if the schema exists
SELECT schema_name FROM information_schema.schemata WHERE schema_name = 'home';

-- Check if the table exists
SELECT * FROM home.comments LIMIT 1;

-- Check if the function exists
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'home' AND routine_name = 'increment_comment_likes';
```

## Step 4: Test the System

1. Start your development server: `npm run dev`
2. Navigate to a blog post or the about page
3. Try adding a comment
4. You should see a success message indicating the comment is pending approval

## Manual Comment Moderation

### View Pending Comments

```sql
SELECT id, content_id, locale, name, message, created_at 
FROM home.comments 
WHERE is_visible = false 
ORDER BY created_at DESC;
```

### Approve a Comment

```sql
UPDATE home.comments 
SET is_visible = true, updated_at = NOW()
WHERE id = <comment_id>;
```

### Hide/Reject a Comment

```sql
UPDATE home.comments 
SET is_visible = false, updated_at = NOW()
WHERE id = <comment_id>;
```

### Delete a Comment (Permanent)

```sql
DELETE FROM home.comments 
WHERE id = <comment_id>;
```

## Content ID Convention

The system uses a specific content ID format to organize comments:

| Content Type | Format | Example |
|-------------|---------|---------|
| Blog Posts | `article-{folder}` | `article-no-code-era` |
| Guestbook | `guestbook` | `guestbook` |
| Other Pages | `page-{pageName}` | `page-about`, `page-contact` |

## Using the UnifiedComments Component

To add comments to any page, use the `UnifiedComments` component:

```tsx
import { UnifiedComments } from "@/components/unified-comments";

// In your page component
<UnifiedComments 
  contentId="article-your-article-slug"  // Required: unique identifier
  locale={locale}                         // Required: "es" or "en"
  contentTitle="Optional Title"           // Optional: shows in placeholder
/>
```

### Example: Blog Post

```tsx
<UnifiedComments 
  contentId={`article-${folder}`}
  locale={locale}
  contentTitle={post.metadata.title}
/>
```

### Example: Guestbook

```tsx
<UnifiedComments 
  contentId="guestbook"
  locale={locale}
/>
```

### Example: Custom Page

```tsx
<UnifiedComments 
  contentId="page-contact"
  locale={locale}
/>
```

## Features

- ✅ Multi-language support (comments stored per locale)
- ✅ Manual approval system (all comments start as `is_visible = false`)
- ✅ Like functionality with optimistic updates
- ✅ Loading and error states
- ✅ Success message after submission
- ✅ Responsive design with dark mode support
- ✅ Isolated `home` schema (doesn't interfere with other projects)

## Database Schema

### `home.comments` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL | Primary key (autoincrement) |
| `content_id` | TEXT | Content identifier (e.g., "article-no-code-era") |
| `locale` | TEXT | Language code ("es" or "en") |
| `name` | TEXT | Commenter's name |
| `message` | TEXT | Comment content |
| `twitter` | TEXT | Twitter/X handle (optional) |
| `email` | TEXT | Email address (optional, not displayed) |
| `created_at` | TIMESTAMPTZ | When the comment was created |
| `updated_at` | TIMESTAMPTZ | When the comment was last updated |
| `likes` | INTEGER | Number of likes (default: 0) |
| `is_visible` | BOOLEAN | Approval status (default: false) |

### Indexes

- `idx_comments_content_locale_visible` on `(content_id, locale, is_visible)`
- `idx_comments_created_at` on `created_at DESC`

## Security

- **Row Level Security (RLS)** is enabled
- Public users can:
  - Read approved comments (`is_visible = true`)
  - Insert new comments (which are pending approval)
- Public users cannot:
  - Update comments
  - Delete comments
  - See unapproved comments
- Manual approval must be done through Supabase dashboard or service role

## Future Enhancements

Potential features for future implementation:

- Translation system to show comments in different languages
- Admin dashboard for easier comment moderation
- Email notifications for new comments
- Reply/threading system (schema already supports via `parent_comment_id`)
- Spam detection/filtering
- Rate limiting for comment submission

## Troubleshooting

### Comments not showing up

1. Check that the SQL schema was executed successfully
2. Verify environment variables are set correctly
3. Check browser console for errors
4. Verify the comment was approved: `SELECT * FROM home.comments WHERE is_visible = true;`

### "Failed to load comments" error

1. Check your Supabase URL and anon key
2. Verify RLS policies are set up correctly
3. Check that the `home` schema exists
4. Look at browser console for detailed error messages

### Like button not working

1. Verify the `increment_comment_likes` function exists
2. Check that grants were applied: `GRANT EXECUTE ON FUNCTION home.increment_comment_likes TO anon, authenticated;`
3. Ensure the comment is visible (`is_visible = true`)

## Support

If you encounter issues, check:
1. Supabase project logs
2. Browser console for client-side errors
3. Network tab to see API requests/responses
