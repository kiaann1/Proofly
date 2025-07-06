// This file can be used to export blog post metadata for easier management
import { getAllBlogPosts, getBlogPostById } from '../../lib/blogUtils';

export {
  getAllBlogPosts,
  getBlogPostById
};

// List of all blog post IDs for reference
export const BLOG_POST_IDS = [
  'ats-resume-optimisation-2025',
  'resume-mistakes-2025',
  'cover-letter-guide-2025',
  'remote-work-resume-tips',
  'interview-questions-2025',
  'career-change-resume-guide',
  'linkedin-profile-optimization'
] as const;

export type BlogPostId = typeof BLOG_POST_IDS[number];
