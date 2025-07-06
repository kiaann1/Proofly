import { NextResponse } from 'next/server';
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
  category: 'resume-tips' | 'career-advice' | 'interview' | 'ats-optimisation' | 'Templates' | 'Job Search' | 'Career Development' | 'CV Writing' | 'Graduate Advice';
  tags: string[];
  featured?: boolean;
}

const blogsDirectory = path.join(process.cwd(), 'src/data/blogs');

function getAllBlogPosts(): BlogPost[] {
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

export async function GET() {
  try {
    const posts = getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in blog API:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}
