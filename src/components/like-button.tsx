"use client";

import { Heart } from "lucide-react";
import { usePostLikes } from "@/hooks/use-post-likes";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postSlug: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

export function LikeButton({ 
  postSlug, 
  size = "md", 
  showCount = true, 
  className 
}: LikeButtonProps) {
  const { toggleLike, getLikeCount, isLiked, isLoading } = usePostLikes();
  
  const liked = isLiked(postSlug);
  const likeCount = getLikeCount(postSlug);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <button
      onClick={() => toggleLike(postSlug)}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1 transition-all duration-200 group",
        "active:scale-95",
        isLoading && "opacity-50 cursor-not-allowed",
        className
      )}
      aria-label={liked ? "Quitar me gusta" : "Me gusta"}
      title={isLoading ? "Loading..." : undefined}
    >
      <Heart 
        className={cn(
          sizeClasses[size],
          "transition-all duration-200",
          liked 
            ? "fill-red-500 text-red-500" 
            : "text-muted-foreground group-hover:text-red-400 group-hover:fill-red-100"
        )}
      />
      {showCount && (
        <span className={cn(
          textSizeClasses[size],
          "font-medium transition-colors duration-200",
          liked 
            ? "text-red-500" 
            : "text-muted-foreground group-hover:text-red-400"
        )}>
          {likeCount}
        </span>
      )}
    </button>
  );
}
