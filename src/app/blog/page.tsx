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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resume & Career Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert tips, strategies, and insights to help you land your dream job. 
              From ATS optimisation to interview mastery, we've got you covered.
            </p>
          </div>

          {/* Category Filter */}
          <section className="mb-12">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
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
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {category.name} ({categoryCounts[key] || 0})
                </button>
              ))}
            </div>
          </section>          {/* All Blog Posts */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {selectedCategory === 'all' ? 'All Posts' : `${categories[selectedCategory]?.name || 'Articles'}`}
              <span className="text-gray-500 font-normal text-lg ml-2">
                ({filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'})
              </span>
            </h2>
            
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No articles found in this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                  >                    <div className="p-8">                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[post.category]?.color || 'bg-gray-100 text-gray-800'}`}>
                          {categories[post.category]?.name || post.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
                        <Link href={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
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
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
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
