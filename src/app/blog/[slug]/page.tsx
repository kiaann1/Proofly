import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

// Force dynamic rendering to avoid SSG issues
export const dynamic = 'force-dynamic';

import AppLayout from '../../../components/layout/AppLayout';
import Link from 'next/link';
import { getBlogPostById, getAllBlogPosts, getAllCategories, getRecentBlogPosts } from '../../../lib/blogUtils.server';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostById(slug);

  if (!post) {
    return {
      title: 'Blog Post Not Found | Proofly',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Proofly Blog`,
    description: post.excerpt,
    keywords: [...post.tags, 'resume tips', 'career advice', 'job search'],
    authors: [{ name: post.author }],
    creator: 'Proofly',
    publisher: 'Proofly',
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://proofly.com/blog/${post.id}`,
      siteName: 'Proofly',
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishDate,
      authors: [post.author],
      images: [
        {
          url: '/og-blog.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: ['/og-blog.png'],
      creator: '@proofly',
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://proofly.com/blog/${post.id}`,
    },
  };
}

// Generate static params for all blog posts
export function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostById(slug);
  const categories = getAllCategories();
  const recentPosts = getRecentBlogPosts(3);

  if (!post) {
    notFound();
  }  // Convert markdown-style content to HTML for display
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];

    const processInlineFormatting = (text: string, key: number) => {
      // Handle bold text with **text**
      if (text.includes('**')) {
        const parts = text.split('**');
        return (
          <span key={key}>
            {parts.map((part, i) => (
              i % 2 === 1 ? (
                <strong key={i} className="font-semibold text-gray-900">{part}</strong>
              ) : (
                <span key={i}>{part}</span>
              )
            ))}
          </span>
        );
      }
      return text;
    };

    const flushList = () => {
      if (inList && listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside mb-6 space-y-2 ml-4">
            {listItems}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines but add spacing
      if (trimmedLine === '') {
        flushList();
        return;
      }

      // Handle headers
      if (trimmedLine.startsWith('# ')) {
        flushList();
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
            {trimmedLine.slice(2)}
          </h1>
        );
        return;
      }

      if (trimmedLine.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-8">
            {trimmedLine.slice(3)}
          </h2>
        );
        return;
      }

      if (trimmedLine.startsWith('### ')) {
        flushList();
        elements.push(
          <h3 key={index} className="text-xl font-bold text-gray-900 mb-3 mt-6">
            {trimmedLine.slice(4)}
          </h3>
        );
        return;
      }

      if (trimmedLine.startsWith('#### ')) {
        flushList();
        elements.push(
          <h4 key={index} className="text-lg font-bold text-gray-900 mb-3 mt-4">
            {trimmedLine.slice(5)}
          </h4>
        );
        return;
      }

      // Handle bullet points
      if (trimmedLine.startsWith('- ')) {
        if (!inList) {
          inList = true;
        }
        listItems.push(
          <li key={index} className="text-gray-700 leading-relaxed">
            {processInlineFormatting(trimmedLine.slice(2), index)}
          </li>
        );
        return;
      }

      // Handle quoted examples (starting with ")
      if (trimmedLine.startsWith('"') && trimmedLine.endsWith('"')) {
        flushList();
        elements.push(
          <blockquote key={index} className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 italic">
            <p className="text-gray-700 leading-relaxed">
              {processInlineFormatting(trimmedLine, index)}
            </p>
          </blockquote>
        );
        return;
      }

      // Handle framework labels (like "Framework: Something")
      if (trimmedLine.includes('Framework:') || trimmedLine.includes('Example:') || trimmedLine.includes('Tips:')) {
        flushList();
        elements.push(
          <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-gray-800 font-medium leading-relaxed">
              {processInlineFormatting(trimmedLine, index)}
            </p>
          </div>
        );
        return;
      }

      // Handle checkboxes (✅)
      if (trimmedLine.startsWith('✅') || trimmedLine.startsWith('- ✅')) {
        if (!inList) {
          inList = true;
        }
        const text = trimmedLine.replace(/^- ✅\s*/, '').replace(/^✅\s*/, '');
        listItems.push(
          <li key={index} className="text-gray-700 leading-relaxed flex items-start">
            <span className="text-green-500 mr-2 mt-1">✅</span>
            <span>{processInlineFormatting(text, index)}</span>
          </li>
        );
        return;
      }

      // Handle regular paragraphs
      flushList();
      
      // Skip lines that look like code blocks
      if (trimmedLine.startsWith('```')) {
        return;
      }

      // Process as paragraph
      if (trimmedLine.length > 0) {
        elements.push(
          <p key={index} className="text-gray-700 mb-4 leading-relaxed">
            {processInlineFormatting(trimmedLine, index)}
          </p>
        );
      }
    });

    // Flush any remaining list
    flushList();

    return elements;
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium">
              ← Back to Blog
            </Link>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[post.category].color}`}>
                {categories[post.category].name}
              </span>
              <span className="text-gray-500">{post.readTime} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
              <div className="flex items-center">
                <div>
                  <p className="font-medium text-gray-900">{post.author}</p>
                  <p className="text-gray-500 text-sm">{new Date(post.publishDate).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>          {/* Article Content */}
          <article className="max-w-none">
            <div className="text-gray-800 leading-relaxed space-y-1">
              {formatContent(post.content)}
            </div>
          </article>

          {/* Related Posts */}
          {recentPosts.length > 0 && (
            <section className="mt-16 border-t border-gray-200 pt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recentPosts.filter(p => p.id !== post.id).slice(0, 3).map((relatedPost) => (
                  <article
                    key={relatedPost.id}
                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${categories[relatedPost.category].color}`}>
                        {categories[relatedPost.category].name}
                      </span>
                      <span className="text-xs text-gray-500">{relatedPost.readTime} min</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${relatedPost.id}`}>
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{relatedPost.excerpt}</p>
                    <Link
                      href={`/blog/${relatedPost.id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                      Read more →
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Apply These Tips?</h2>
            <p className="text-lg mb-6 opacity-90">
              Build your perfect resume with our free, professional CV builder
            </p>
            <Link
              href="/cv"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Your CV Now
            </Link>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
