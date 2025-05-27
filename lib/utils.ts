/**
 * @fileoverview Utility functions for handling CSS class names and Tailwind CSS
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * This utility helps prevent class name conflicts when using Tailwind CSS
 * 
 * @param inputs - Array of class names or conditional class objects
 * @returns Merged and de-duplicated class string
 * 
 * @example
 * cn('px-2 py-1', { 'bg-blue-500': isActive }, 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
