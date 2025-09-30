# Enable Anonymous Authentication in Supabase

## Error You're Seeing

```
AuthApiError: Database error creating anonymous user
```

This error occurs because **Anonymous Sign-In is not enabled** in your Supabase project.

## Solution 1: Enable via Supabase Dashboard (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers** (left sidebar)
4. Scroll down to find **"Anonymous Sign-In"**
5. Toggle the switch to **ON** (green)
6. The change is instant - no need to save

## Solution 2: Enable via API (if you have project access)

If you have access to your project's service role key, you can enable it programmatically:

```bash
curl -X PATCH 'https://api.supabase.com/v1/projects/{project_ref}/config/auth' \
  -H "Authorization: Bearer {service_role_key}" \
  -H "Content-Type: application/json" \
  -d '{
    "EXTERNAL_ANONYMOUS_USERS_ENABLED": true
  }'
```

Replace:
- `{project_ref}` with your project reference
- `{service_role_key}` with your service role key

## Solution 3: Check Current Status

You can verify if anonymous auth is enabled by checking your project's auth config:

```bash
curl 'https://api.supabase.com/v1/projects/{project_ref}/config/auth' \
  -H "Authorization: Bearer {service_role_key}"
```

Look for `"EXTERNAL_ANONYMOUS_USERS_ENABLED": true` in the response.

## What Happens After Enabling

Once enabled:
1. Users visiting your site will automatically sign in anonymously
2. They get a unique UUID from Supabase Auth
3. Their likes will be tracked and persist across sessions
4. They can later upgrade to permanent accounts by linking email/OAuth

## Testing

After enabling, reload your app and:
1. Open the browser console
2. You should no longer see the error
3. The like button should work normally
4. Check Supabase Dashboard → Authentication → Users
5. You should see anonymous users appearing with `is_anonymous: true`

## Troubleshooting

If you still get errors after enabling:

1. **Clear browser cache and reload**
2. **Check browser console** for any other errors
3. **Verify your Supabase credentials** in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. **Check RLS policies** - make sure they allow anonymous users to read/write

## Security Notes

- Anonymous users use the `authenticated` role in Postgres
- They have an `is_anonymous` claim in their JWT
- You can distinguish them in RLS policies if needed
- Set up automatic cleanup for old anonymous users (see Supabase docs)
- Consider enabling CAPTCHA to prevent abuse

## References

- [Supabase Anonymous Sign-In Documentation](https://supabase.com/docs/guides/auth/auth-anonymous)
- [GitHub Issue #68](https://github.com/supabase/auth/issues/68) - Original feature request
- [Auth Configuration API](https://supabase.com/docs/reference/api/auth-config)

---

**After enabling, your likes functionality will work perfectly!** 🎉
