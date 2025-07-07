'use client';

import React, { useState, useMemo, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import Link from 'next/link';
import { 
  BlogPost, 
  fetchAllBlogPosts, 
  getBlogPostsByCategory, 
  getAllCategories 
} from '../../lib/blogUtils.client';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categories = getAllCategories();  // Load blog posts on component mount
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      const posts = await fetchAllBlogPosts();
      setAllPosts(posts);
      setLoading(false);
    };
    loadPosts();  }, []);

  // Filter posts based on selected category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') {
      return allPosts;
    }
    return getBlogPostsByCategory(allPosts, selectedCategory as BlogPost['category']);
  }, [allPosts, selectedCategory]);

  // Get category counts
  const categoryCounts = useMemo(() => {
    const counts: { [key: string]: number } = { all: allPosts.length };
    allPosts.forEach((post: BlogPost) => {
      counts[post.category] = (counts[post.category] || 0) + 1;
    });
    return counts;
  }, [allPosts]);

  if (loading) {
    return (
      <AppLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading blog posts...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          {/* Header - Responsive */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6">
              Resume & Career Blog
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Expert tips, strategies, and insights to help you land your dream job. 
              From ATS optimisation to interview mastery, we&apos;ve got you covered.
            </p>
          </div>

          {/* Category Filter - Mobile Responsive */}
          <section className="mb-8 sm:mb-10 lg:mb-12">
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Posts ({categoryCounts.all})
              </button>
              {Object.entries(categories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({categoryCounts[key] || 0})
                </button>
              ))}
            </div>
          </section>

          {/* All Blog Posts - Responsive Grid */}
          <section className="mb-12 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              {selectedCategory === 'all' ? 'All Posts' : `${categories[selectedCategory]?.name || 'Articles'}`}
              <span className="text-gray-500 font-normal text-base sm:text-lg ml-2">
                ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})
              </span>
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-base sm:text-lg">No articles found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="p-4 sm:p-6 lg:p-8">
                      <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${categories[post.category]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {categories[post.category]?.name || post.category}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base">
                        {post.excerpt}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-center text-xs sm:text-sm text-gray-500">
                          <span>{post.readTime} min read</span>
                          <span className="mx-2">•</span>
                          <span>{new Date(post.publishDate).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                        <Link
                          href={`/blog/${post.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm self-start sm:self-auto"
                        >
                          Read Post →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* CTA Section - Responsive */}
          <section className="mt-12 sm:mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl lg:rounded-2xl p-6 sm:p-8 text-center text-white">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 opacity-90">
              Put these tips into action with our free, professional CV builder
            </p>
            <Link
              href="/cv"
              className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Start Building Your CV
            </Link>
          </section>
        </div>
      </div>
    </AppLayout>
  );
}
