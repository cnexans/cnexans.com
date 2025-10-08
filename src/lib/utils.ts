import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BlogPost } from "@/content/utils"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color palette array with 6 different colors
const COLOR_PALETTE = [
  "bg-blue-100 text-blue-800 border-blue-200",
  "bg-green-100 text-green-800 border-green-200",
  "bg-purple-100 text-purple-800 border-purple-200",
  "bg-orange-100 text-orange-800 border-orange-200",
  "bg-pink-100 text-pink-800 border-pink-200",
  "bg-cyan-100 text-cyan-800 border-cyan-200",
];

/**
 * Creates a tag-to-color mapping based on all posts
 * @param posts - Array of blog posts
 * @returns Function that returns color classes for a given tag array
 */
export function createTagColorMap(posts: BlogPost[]) {
  // Get all unique tags and create a mapping to colors
  const allTags = Array.from(new Set(posts.flatMap(post => post.metadata.tags)));
  const tagColorMap = new Map<string, string>();
  
  allTags.forEach((tag, index) => {
    const colorIndex = index % COLOR_PALETTE.length; // Cycle through colors using modulo
    tagColorMap.set(tag.toLowerCase(), COLOR_PALETTE[colorIndex]);
  });

  // Return a function that gets the color style for given tags
  return (tags: string[]): string => {
    if (!tags || tags.length === 0) return "bg-gray-100 text-gray-800 border-gray-200";
    
    const tag = tags[0].toLowerCase();
    return tagColorMap.get(tag) || "bg-gray-100 text-gray-800 border-gray-200";
  };
}
