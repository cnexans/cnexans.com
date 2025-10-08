import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { BlogPost } from "@/content/utils"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color palette array with 6 different colors (light mode & dark mode support)
const COLOR_PALETTE = [
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
  "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
  "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50",
  "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800/50",
  "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-300 dark:border-pink-800/50",
  "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800/50",
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
    if (!tags || tags.length === 0) return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50";
    
    const tag = tags[0].toLowerCase();
    return tagColorMap.get(tag) || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/30 dark:text-gray-300 dark:border-gray-700/50";
  };
}
