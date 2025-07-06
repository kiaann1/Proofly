import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume & Career Blog - Expert Tips for Job Success | Proofly',
  description: 'Get expert resume writing tips, ATS optimisation strategies, interview advice, and career guidance. Free professional advice to help you land your dream job.',
  keywords: [
    'resume tips', 'CV writing', 'job search', 'career advice', 'ATS optimisation',
    'interview tips', 'professional development', 'resume templates', 'cover letter',
    'job application', 'career guidance', 'employment tips', 'job hunting'
  ],
  authors: [{ name: 'Proofly Career Team' }],
  creator: 'Proofly',
  publisher: 'Proofly',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Resume & Career Blog - Expert Tips for Job Success | Proofly',
    description: 'Get expert resume writing tips, ATS optimisation strategies, interview advice, and career guidance. Free professional advice to help you land your dream job.',
    url: 'https://proofly.com/blog',
    siteName: 'Proofly',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-blog.png',
        width: 1200,
        height: 630,
        alt: 'Proofly Blog - Resume and Career Advice',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Resume & Career Blog - Expert Tips for Job Success | Proofly',
    description: 'Get expert resume writing tips, ATS optimisation strategies, interview advice, and career guidance. Free professional advice to help you land your dream job.',
    images: ['/og-blog.png'],
    creator: '@proofly',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://proofly.com/blog',
  },
};

import React from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Link from 'next/link';
import { getAllBlogPosts, getFeaturedBlogPosts, getRecentBlogPosts, getAllCategories } from '../../lib/blogUtils';

export default function BlogPage() {
  const featuredPosts = getFeaturedBlogPosts();
  const recentPosts = getRecentBlogPosts(9);
  const categories = getAllCategories();

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resume & Career Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert tips, strategies, and insights to help you land your dream job. 
              From ATS optimisation to interview mastery, we've got you covered.
            </p>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[post.category].color}`}>
                          {categories[post.category].name}
                        </span>
                        <span className="text-sm text-gray-500">{post.readTime} min read</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.author}</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                        </div>
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Recent Posts */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${categories[post.category].color}`}>
                        {categories[post.category].name}
                      </span>
                      <span className="text-xs text-gray-500">{post.readTime} min</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                      <Link href={`/blog/${post.id}`}>
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                      <Link
                        href={`/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Read →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Perfect Resume?</h2>
            <p className="text-lg mb-6 opacity-90">
              Put these tips into action with our free, professional CV builder
            </p>
            <Link
              href="/cv"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Building Your CV
            </Link>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
