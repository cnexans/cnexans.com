# Post Likes Functionality

## Overview
The post likes system allows users to like blog posts and other content on the site. Likes are stored in Supabase using **Supabase Anonymous Authentication** for user identity management. Anonymous users can later convert to permanent users by linking an email or OAuth identity.

## Database Structure

### Table: `post_likes`
- `id`: Serial primary key
- `content_id`: Text identifier for the content (e.g., `article-no-code-era`)
- `user_id`: UUID foreign key to `auth.users.id`
- `created_at`: Timestamp of when the like was created
- Unique constraint on `(content_id, user_id)` to prevent duplicate likes
- Foreign key with `ON DELETE CASCADE` to automatically clean up likes when user is deleted

### Database Functions

#### `get_post_like_count(content_id TEXT)`
Returns the total number of likes for a given content ID.

```sql
SELECT public.get_post_like_count('article-no-code-era');
```

#### `has_user_liked_post(content_id TEXT, user_id UUID)`
Checks if a specific user has liked a given content.

```sql
SELECT public.has_user_liked_post('article-no-code-era', 'user-uuid-here');
```

#### `toggle_post_like(content_id TEXT, user_id UUID)`
Toggles a like for a user on a specific content. Returns a JSONB object with the new state.

```sql
SELECT public.toggle_post_like('article-no-code-era', 'user-uuid-here');
-- Returns: {"liked": true, "count": 5}
```

#### `get_user_liked_posts(user_id UUID)`
Returns all content IDs that a user has liked.

```sql
SELECT * FROM public.get_user_liked_posts('user-uuid-here');
```

## Content ID Convention

The content ID follows the same convention as comments:

- **Blog posts**: `article-{folder}`
  - Example: `article-no-code-era`, `article-agi-phase-2`
- **Guestbook**: `guestbook`
- **Other pages**: `page-{pageName}`
  - Example: `page-about`, `page-contact`

## Frontend Implementation

### Components

#### `LikeButton`
Location: `/src/components/like-button.tsx`

A reusable button component that displays a heart icon and like count.

```tsx
<LikeButton 
  postSlug="article-no-code-era" 
  size="lg" 
  showCount={true} 
/>
```

Props:
- `postSlug`: The content ID to like
- `size`: Button size (`sm` | `md` | `lg`)
- `showCount`: Whether to display the like count (default: `true`)
- `className`: Additional CSS classes

### Hooks

#### `usePostLikes`
Location: `/src/hooks/use-post-likes.tsx`

A custom hook that manages post likes state and interactions.

```tsx
const { toggleLike, getLikeCount, isLiked, isLoading } = usePostLikes();
```

Features:
- Automatic user fingerprint generation
- Loads user's liked posts on mount
- Lazy loading of like counts
- Optimistic updates with error handling
- Automatic sync with Supabase

### API Functions

Location: `/src/lib/post-likes.ts`

#### `ensureAuthenticatedUser()`
Ensures the user is signed in (anonymously or permanently). Returns the user ID.
- Checks if user already has a session
- If not, signs in anonymously using `supabase.auth.signInAnonymously()`
- Returns the user's UUID

#### `getPostLikeCount(contentId: string)`
Fetches the like count for a specific content.

#### `hasUserLikedPost(contentId: string, userId: string)`
Checks if a user has liked a content.

#### `togglePostLike(contentId: string, userId: string)`
Toggles a like and returns the new state.

#### `getUserLikedPosts(userId: string)`
Gets all content IDs that a user has liked.

#### `getMultiplePostLikeCounts(contentIds: string[])`
Batch fetches like counts for multiple posts.

## Usage Example

In a blog post page:

```tsx
import { LikeButton } from "@/components/like-button";

export default function BlogPost({ folder }: { folder: string }) {
  return (
    <article>
      <h1>My Blog Post</h1>
      <LikeButton postSlug={`article-${folder}`} size="lg" />
      {/* Post content */}
    </article>
  );
}
```

## Security

- **Uses Supabase Anonymous Authentication** - No manual fingerprinting needed
- Row Level Security (RLS) is enabled on the `post_likes` table
- All database functions use `SECURITY DEFINER` with fixed `search_path`
- Public read access is allowed for like counts
- Insert and delete operations are controlled through RPC functions
- Foreign key ensures referential integrity with `auth.users`
- Anonymous users can upgrade to permanent users by linking identities

## Migrations

The likes functionality was implemented through the following migrations:

1. `006_create-post-likes-table.sql` - Creates the table and functions
2. `007_configure-post-likes-rls.sql` - Sets up RLS policies
3. `008_fix-post-likes-security.sql` - Fixes security warnings by setting search_path
4. `009_update-post-likes-for-auth.sql` - **Updated to use Supabase Anonymous Auth** (replaces user_fingerprint with user_id)

## Testing

To test the implementation:

```sql
-- Get like count for a post
SELECT public.get_post_like_count('article-test');

-- Get a test user ID (or create anonymous user via API)
-- For testing, you can use any valid UUID from auth.users

-- Like a post (replace with actual user UUID)
SELECT public.toggle_post_like('article-test', 'user-uuid-here');

-- Check if user liked the post
SELECT public.has_user_liked_post('article-test', 'user-uuid-here');

-- Get all posts liked by user
SELECT * FROM public.get_user_liked_posts('user-uuid-here');

-- Unlike the post
SELECT public.toggle_post_like('article-test', 'user-uuid-here');
```

## Future Improvements

Potential enhancements:
- Add rate limiting to prevent abuse
- Add analytics for tracking popular content
- Support for different types of reactions (not just likes)
- Add notification system for content creators
- Implement automatic cleanup of old anonymous users (see [Supabase Anonymous Auth docs](https://supabase.com/docs/guides/auth/auth-anonymous))
- Add UI for converting anonymous users to permanent users
