# Post Likes Functionality

## Overview
The post likes system allows users to like blog posts and other content on the site. Likes are stored in Supabase and tracked by content ID, similar to the comments system.

## Database Structure

### Table: `post_likes`
- `id`: Serial primary key
- `content_id`: Text identifier for the content (e.g., `article-no-code-era`)
- `user_fingerprint`: Unique identifier for the user
- `created_at`: Timestamp of when the like was created
- Unique constraint on `(content_id, user_fingerprint)` to prevent duplicate likes

### Database Functions

#### `get_post_like_count(content_id TEXT)`
Returns the total number of likes for a given content ID.

```sql
SELECT public.get_post_like_count('article-no-code-era');
```

#### `has_user_liked_post(content_id TEXT, user_fingerprint TEXT)`
Checks if a specific user has liked a given content.

```sql
SELECT public.has_user_liked_post('article-no-code-era', 'user123');
```

#### `toggle_post_like(content_id TEXT, user_fingerprint TEXT)`
Toggles a like for a user on a specific content. Returns a JSONB object with the new state.

```sql
SELECT public.toggle_post_like('article-no-code-era', 'user123');
-- Returns: {"liked": true, "count": 5}
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

#### `generateUserFingerprint()`
Creates a unique identifier for anonymous users and stores it in localStorage.

#### `getPostLikeCount(contentId: string)`
Fetches the like count for a specific content.

#### `hasUserLikedPost(contentId: string, userFingerprint: string)`
Checks if a user has liked a content.

#### `togglePostLike(contentId: string, userFingerprint: string)`
Toggles a like and returns the new state.

#### `getUserLikedPosts(userFingerprint: string)`
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

- Row Level Security (RLS) is enabled on the `post_likes` table
- All database functions use `SECURITY DEFINER` with fixed `search_path`
- Public read access is allowed for like counts
- Insert and delete operations are controlled through RPC functions
- User fingerprints are stored in localStorage and are not personally identifiable

## Migrations

The likes functionality was implemented through the following migrations:

1. `006_create-post-likes-table.sql` - Creates the table and functions
2. `007_configure-post-likes-rls.sql` - Sets up RLS policies
3. `008_fix-post-likes-security.sql` - Fixes security warnings by setting search_path

## Testing

To test the implementation:

```sql
-- Get like count for a post
SELECT public.get_post_like_count('article-test');

-- Like a post
SELECT public.toggle_post_like('article-test', 'test-user-123');

-- Check if user liked the post
SELECT public.has_user_liked_post('article-test', 'test-user-123');

-- Unlike the post
SELECT public.toggle_post_like('article-test', 'test-user-123');
```

## Future Improvements

Potential enhancements:
- Add rate limiting to prevent abuse
- Implement more sophisticated user fingerprinting
- Add analytics for tracking popular content
- Support for different types of reactions (not just likes)
- Add notification system for content creators
