# Database Schema

## Quick Start

This project uses a **single schema file** instead of migrations:

```bash
# Apply the complete schema to your Supabase project
psql -h <your-db-host> -U postgres -d postgres -f schema.sql
```

Or use Supabase Dashboard:
1. Go to SQL Editor
2. Copy contents of `schema.sql`
3. Run the query

## Schema File

**`schema.sql`** - Complete database schema with:
- 📝 Comments table (moderated comments)
- 📧 Contacts table (contact form submissions)
- ❤️ Post likes table (likes with anonymous auth)
- 🔧 Helper functions
- 🔓 No RLS (permissions granted directly)

## Tables

### `comments`
User comments on blog posts. Moderated (`is_visible = false` by default).

### `contacts`
Contact form submissions. Admin-only access via Dashboard.

### `post_likes`
Post likes using Supabase Anonymous Authentication.

## No Migrations

We keep it simple with a single schema file instead of incremental migrations.

Benefits:
- ✅ Single source of truth
- ✅ Easy to understand
- ✅ Quick to apply to new environments
- ✅ No migration order complexity

## Important Notes

### Anonymous Authentication Required

For likes to work, enable Anonymous Sign-In in Supabase:
1. Authentication → Providers
2. Enable "Anonymous Sign-In"

See `ENABLE_ANONYMOUS_AUTH.md` for details.

### No RLS Policy

This project doesn't use Row Level Security. See `NO_RLS_POLICY.md` for reasoning.

## Documentation

- `schema.sql` - The complete database schema
- `NO_RLS_POLICY.md` - Why we don't use RLS
- `ENABLE_ANONYMOUS_AUTH.md` - How to enable anonymous auth

## Old Migration Files

Migration files `000_*.sql` through `011_*.sql` are deprecated.
Use `schema.sql` instead for new deployments.