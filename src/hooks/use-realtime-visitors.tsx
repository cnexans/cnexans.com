"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export function useRealtimeVisitors() {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let channel: RealtimeChannel;

    const setupPresence = async () => {
      // Create a channel for tracking site-wide visitors
      channel = supabase.channel("site-visitors", {
        config: {
          presence: {
            key: crypto.randomUUID(), // Generate unique key for each visitor
          },
        },
      });

      // Listen to presence sync events to update visitor count
      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState();
          const count = Object.keys(state).length;
          setVisitorCount(count);
          setIsConnected(true);
        })
        .on("presence", { event: "join" }, ({ key, newPresences }) => {
          console.log("User joined:", key, newPresences);
        })
        .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          console.log("User left:", key, leftPresences);
        });

      // Subscribe to the channel
      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          // Track this user's presence
          const presenceTrackStatus = await channel.track({
            online_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
          });
          console.log("Presence tracking status:", presenceTrackStatus);
        }
      });
    };

    setupPresence();

    // Cleanup function
    return () => {
      if (channel) {
        channel.untrack();
        channel.unsubscribe();
      }
    };
  }, []);

  return { visitorCount, isConnected };
}


