export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: 'resume-tips' | 'career-advice' | 'interview' | 'ats-optimisation' | 'Templates' | 'Job Search' | 'Career Development' | 'CV Writing' | 'Graduate Advice';
  tags: string[];
  featured?: boolean;
}

// Client-side utility functions for blog data
export function getFeaturedBlogPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(post => post.featured);
}

export function getBlogPostsByCategory(posts: BlogPost[], category: BlogPost['category']): BlogPost[] {
  return posts.filter(post => post.category === category);
}

export function getBlogPostsByTag(posts: BlogPost[], tag: string): BlogPost[] {
  return posts.filter(post => post.tags.includes(tag));
}

export function getRecentBlogPosts(posts: BlogPost[], limit: number = 6): BlogPost[] {
  return posts.slice(0, limit);
}

export function getAllCategories(): { [key: string]: { name: string; color: string } } {
  return {
    'resume-tips': { name: 'Resume Tips', color: 'bg-blue-100 text-blue-800' },
    'career-advice': { name: 'Career Advice', color: 'bg-green-100 text-green-800' },
    'interview': { name: 'Interview Tips', color: 'bg-purple-100 text-purple-800' },
    'ats-optimisation': { name: 'ATS Optimisation', color: 'bg-orange-100 text-orange-800' },
    'Templates': { name: 'Templates', color: 'bg-indigo-100 text-indigo-800' },
    'Job Search': { name: 'Job Search', color: 'bg-pink-100 text-pink-800' },
    'Career Development': { name: 'Career Development', color: 'bg-teal-100 text-teal-800' },
    'CV Writing': { name: 'CV Writing', color: 'bg-cyan-100 text-cyan-800' },
    'Graduate Advice': { name: 'Graduate Advice', color: 'bg-yellow-100 text-yellow-800' }
  };
}

export function getAllTags(posts: BlogPost[]): string[] {
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

// API fetch functions
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog');
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchBlogPostById(id: string): Promise<BlogPost | null> {
  try {
    const posts = await fetchAllBlogPosts();
    return posts.find(post => post.id === id) || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
