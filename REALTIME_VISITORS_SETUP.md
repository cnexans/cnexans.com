# Real-Time Visitor Counter Setup Guide

## Overview
This implementation uses **Supabase Realtime Presence** to track how many users are currently browsing your site across all pages in real-time.

## Features
- ✅ Shows live count of visitors across the entire site
- ✅ Works across all pages (not just home page)
- ✅ Real-time updates when users join/leave
- ✅ Bilingual support (English/Spanish)
- ✅ Animated pulse indicator
- ✅ Auto-reconnects on disconnect

## How It Works

### Architecture
1. **Single Channel**: All pages connect to a shared channel called `"site-visitors"`
2. **Presence Tracking**: Each visitor gets a unique UUID key and tracks their presence
3. **Sync Events**: When users join or leave, all connected clients receive updates
4. **Count Display**: Shows the total number of unique presence states

### Components

#### 1. Hook: `use-realtime-visitors.tsx`
- Manages the Supabase Realtime connection
- Tracks presence state
- Provides visitor count and connection status

#### 2. Component: `realtime-visitor-counter.tsx`
- Displays the visitor count with a nice UI
- Shows loading state while connecting
- Includes animated green pulse indicator
- Supports i18n (English/Spanish)

#### 3. Integration: Updated `page.tsx`
- Replaced old localStorage-based counter with real-time version
- Passes locale for proper translation

## Supabase Configuration

### 1. Enable Realtime
Make sure Realtime is enabled in your Supabase project:
- Go to **Project Settings** > **API**
- Realtime should be enabled by default
- No database configuration needed for Presence (it's purely client-side)

### 2. Environment Variables
Ensure these are set in your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Realtime Quotas
Free tier includes:
- 200 concurrent connections
- 2GB bandwidth per month

For production sites with high traffic, consider upgrading your plan.

## Usage

### On Home Page (Already Implemented)
```tsx
import { RealtimeVisitorCounter } from "@/components/realtime-visitor-counter";

<RealtimeVisitorCounter locale={locale} />
```

### On Other Pages
You can add this component to ANY page to show site-wide visitors:

```tsx
// In any page component
import { RealtimeVisitorCounter } from "@/components/realtime-visitor-counter";

export default function MyPage() {
  return (
    <div>
      <RealtimeVisitorCounter locale="en" />
      {/* Your content */}
    </div>
  );
}
```

## Testing

1. **Open two browser windows** (or one regular + one incognito)
2. Navigate to your home page in both
3. You should see the counter increment to 2
4. Close one window
5. The counter should decrement to 1

## How It's Different from Page Views

| Feature | Old Counter | New Counter |
|---------|-------------|-------------|
| **Type** | Page views (localStorage) | Real-time presence |
| **Scope** | Per-user, per-browser | Site-wide, all users |
| **Updates** | Never (static) | Live (real-time) |
| **Shows** | "How many times YOU visited" | "How many people are online NOW" |
| **Backend** | None | Supabase Realtime |

## Advanced Customization

### Show Visitors Per Page
If you want to track visitors per page instead of site-wide, modify the channel name:

```tsx
// In use-realtime-visitors.tsx
const page = window.location.pathname;
channel = supabase.channel(`page-${page}`, {
  // ...
});
```

### Add User Information
You can track additional user data:

```tsx
await channel.track({
  online_at: new Date().toISOString(),
  user_agent: navigator.userAgent,
  page: window.location.pathname,
  // Add custom data:
  referrer: document.referrer,
  screen_width: window.innerWidth,
});
```

### Cleanup Old Visitor Counter
If you no longer need the old localStorage-based counter, you can remove:
- `/src/components/visitor-counter.tsx`

## Troubleshooting

### Counter Shows 0
- Check browser console for errors
- Verify Supabase environment variables are set
- Ensure Realtime is enabled in Supabase dashboard

### Connection Issues
- Check your Supabase project status
- Verify you haven't exceeded connection limits
- Check browser console for WebSocket errors

### Multiple Tabs
- Each tab counts as a separate visitor (by design)
- This is because each has a unique presence key
- If you want to track unique users across tabs, use a shared localStorage key

## Performance

- **Lightweight**: ~5KB gzipped
- **WebSocket**: Persistent connection (low overhead)
- **Auto-cleanup**: Unsubscribes when component unmounts
- **No polling**: Uses efficient push-based updates

## Documentation

- [Supabase Realtime Presence Docs](https://supabase.com/docs/guides/realtime/presence)
- [Realtime Quotas](https://supabase.com/docs/guides/realtime/quotas)


