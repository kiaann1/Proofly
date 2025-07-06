import fs from 'fs';
import path from 'path';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: 'resume-tips' | 'career-advice' | 'interview' | 'ats-optimisation';
  tags: string[];
  featured?: boolean;
}

const blogsDirectory = path.join(process.cwd(), 'src/data/blogs');

export function getAllBlogPosts(): BlogPost[] {
  try {
    const fileNames = fs.readdirSync(blogsDirectory);
    const blogPosts: BlogPost[] = [];

    fileNames.forEach((fileName) => {
      if (fileName.endsWith('.json')) {
        const filePath = path.join(blogsDirectory, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const blogPost: BlogPost = JSON.parse(fileContent);
        blogPosts.push(blogPost);
      }
    });

    // Sort by publish date (newest first)
    return blogPosts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getBlogPostById(id: string): BlogPost | null {
  try {
    const filePath = path.join(blogsDirectory, `${id}.json`);
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    }
    return null;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}

export function getFeaturedBlogPosts(): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.featured);
}

export function getBlogPostsByCategory(category: BlogPost['category']): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.category === category);
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.tags.includes(tag));
}

export function getRecentBlogPosts(limit: number = 6): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.slice(0, limit);
}

export function getAllCategories(): { [key: string]: { name: string; color: string } } {
  return {
    'resume-tips': { name: 'Resume Tips', color: 'bg-blue-100 text-blue-800' },
    'career-advice': { name: 'Career Advice', color: 'bg-green-100 text-green-800' },
    'interview': { name: 'Interview Tips', color: 'bg-purple-100 text-purple-800' },
    'ats-optimisation': { name: 'ATS Optimisation', color: 'bg-orange-100 text-orange-800' }
  };
}

export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = new Set<string>();
  
  allPosts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}
