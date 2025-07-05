
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resume & Career Blog - Expert Tips for Job Success | Proofly',
  description: 'Get expert resume writing tips, ATS optimization strategies, interview advice, and career guidance. Free professional advice to help you land your dream job.',
  keywords: [
    'resume tips', 'CV writing', 'job search', 'career advice', 'ATS optimization',
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
    description: 'Get expert resume writing tips, ATS optimization strategies, interview advice, and career guidance. Free professional advice to help you land your dream job.',
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
    description: 'Get expert resume writing tips, ATS optimization strategies, interview advice, and career guidance. Free professional advice to help you land your dream job.',
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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: number;
  category: 'resume-tips' | 'career-advice' | 'interview' | 'ats-optimization';
  tags: string[];
  featured?: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: 'ats-resume-optimization-2025',
    title: '10 ATS Resume Optimization Tips That Actually Work in 2025',
    excerpt: 'Learn the latest strategies to make your resume ATS-friendly while still appealing to human recruiters.',
    content: `
# 10 ATS Resume Optimization Tips That Actually Work in 2025

In today's competitive job market, over 98% of Fortune 500 companies use Applicant Tracking Systems (ATS) to filter resumes before they ever reach human eyes. Here's how to beat the bots and land more interviews.

## 1. Use Standard Section Headers

ATS software looks for specific section headers. Stick to conventional titles:
- **Work Experience** (not "Professional Journey")
- **Education** (not "Academic Background") 
- **Skills** (not "Core Competencies")

## 2. Choose ATS-Friendly Formats

- Use standard fonts: Arial, Calibri, or Times New Roman
- Avoid headers, footers, and text boxes
- Skip images, graphics, and complex formatting
- Save as .docx or .pdf (check job posting requirements)

## 3. Include Relevant Keywords

Study the job description and naturally incorporate:
- Required skills and technologies
- Industry-specific terminology
- Job titles and certifications
- Software and tools mentioned

## 4. Optimize Your Professional Summary

Your summary should include:
- Your current role/level
- Years of experience
- Top 2-3 relevant skills
- Key achievement with metrics

## 5. Use Action Verbs and Quantifiable Results

Start bullet points with strong verbs:
- "Achieved 25% increase in sales revenue"
- "Managed team of 15 developers"
- "Reduced processing time by 40%"

## 6. Include a Skills Section

Create a dedicated skills section with:
- Technical skills
- Software proficiency
- Certifications
- Language skills

## 7. Spell Out Acronyms

Include both versions: "Search Engine Optimization (SEO)"

## 8. Avoid Tables and Columns

ATS may not read these correctly. Use simple formatting.

## 9. Test Your Resume

Use tools like Proofly's ATS checker to identify potential issues.

## 10. Tailor for Each Application

Customize your resume for each position, focusing on the most relevant keywords and experiences.

**Remember**: Your resume needs to pass both ATS screening AND impress human recruiters. Balance optimization with readability.
    `,
    author: 'Proofly Team',
    publishDate: '2025-01-06',
    readTime: 8,
    category: 'ats-optimization',
    tags: ['ATS', 'Resume Optimization', 'Job Search', 'Career Tips'],
    featured: true
  },
  {
    id: 'resume-mistakes-2025',
    title: '7 Resume Mistakes That Are Killing Your Job Applications',
    excerpt: 'Avoid these common resume pitfalls that cause recruiters to immediately reject applications.',
    content: `
# 7 Resume Mistakes That Are Killing Your Job Applications

Even qualified candidates can sabotage their chances with these critical resume errors. Here's what to avoid:

## 1. Generic, One-Size-Fits-All Resumes

**The Mistake**: Sending the same resume to every job.

**Why It Fails**: Each role has unique requirements. Generic resumes lack relevant keywords and don't address specific needs.

**The Fix**: Tailor your resume for each application. Adjust your professional summary, highlight relevant experience, and incorporate job-specific keywords.

## 2. Focusing on Duties Instead of Achievements

**The Mistake**: Listing job responsibilities without showing impact.

**Example**: "Responsible for managing social media accounts"

**Why It Fails**: Recruiters want to see results, not just what you were supposed to do.

**The Fix**: "Increased social media engagement by 150% and grew followers from 1,000 to 15,000 in 6 months"

## 3. Using Weak, Passive Language

**The Mistake**: Starting bullets with phrases like "Helped with," "Assisted," or "Responsible for"

**Why It Fails**: These words minimize your contributions and lack impact.

**The Fix**: Use strong action verbs: Led, Developed, Achieved, Implemented, Optimized

## 4. Including Irrelevant Information

**The Mistake**: Adding hobbies, personal photos, or unrelated experience.

**Why It Fails**: Irrelevant information dilutes your professional message and wastes valuable space.

**The Fix**: Only include information that demonstrates relevant skills or adds professional value.

## 5. Poor Formatting and Design

**The Mistake**: Overly complex designs, inconsistent formatting, or hard-to-read fonts.

**Why It Fails**: Poor formatting makes it difficult for both ATS and humans to process your information.

**The Fix**: Use clean, professional formatting with consistent fonts, spacing, and alignment.

## 6. Spelling and Grammar Errors

**The Mistake**: Typos, grammatical errors, or inconsistent tense usage.

**Why It Fails**: Errors signal lack of attention to detail and professionalism.

**The Fix**: Proofread multiple times, use spell-check, and have others review your resume.

## 7. Outdated or Missing Contact Information

**The Mistake**: Using old email addresses, missing phone numbers, or broken LinkedIn links.

**Why It Fails**: Recruiters can't reach you for opportunities.

**The Fix**: Use a professional email address, include current phone number, and ensure all links work.

## Quick Resume Checklist

Before submitting any resume:
- ✅ Tailored to the specific job
- ✅ Results-focused bullet points
- ✅ Strong action verbs throughout
- ✅ Professional formatting
- ✅ Error-free content
- ✅ Current contact information

Remember: Your resume is often your first impression. Make it count!
    `,
    author: 'Proofly Team',
    publishDate: '2025-01-05',
    readTime: 6,
    category: 'resume-tips',
    tags: ['Resume Tips', 'Job Search', 'Career Advice', 'Professional Development'],
    featured: true
  },
  {
    id: 'cover-letter-guide-2025',
    title: 'How to Write a Cover Letter That Gets You Hired',
    excerpt: 'A step-by-step guide to crafting compelling cover letters that complement your resume and land interviews.',
    content: `
# How to Write a Cover Letter That Gets You Hired

A great cover letter can be the difference between getting an interview and having your application ignored. Here's how to write one that works.

## The Purpose of a Cover Letter

Your cover letter should:
- Introduce yourself and express interest
- Explain why you're qualified
- Show personality and cultural fit
- Motivate the reader to review your resume

## Cover Letter Structure

### 1. Header and Salutation
- Include your contact information
- Date
- Employer's contact information
- Address to a specific person when possible

### 2. Opening Paragraph
- State the position you're applying for
- Mention how you learned about the role
- Include a compelling hook

**Example**: "I was excited to discover the Marketing Manager position at [Company] through LinkedIn, as it perfectly aligns with my 5 years of digital marketing experience and passion for data-driven campaigns."

### 3. Body Paragraphs (1-2 paragraphs)
- Highlight 2-3 most relevant qualifications
- Use specific examples with metrics
- Connect your experience to their needs
- Show knowledge of the company

### 4. Closing Paragraph
- Reiterate interest
- Request an interview
- Thank them for their consideration

### 5. Professional Sign-off
- "Sincerely" or "Best regards"
- Your name

## Key Tips for Success

### Customize for Each Application
Never use a generic cover letter. Research the company and role to customize your approach.

### Show, Don't Tell
Instead of saying "I'm a hard worker," provide an example: "I consistently exceeded sales targets by 20% through dedicated client relationship building."

### Keep It Concise
Aim for 3-4 paragraphs and under one page.

### Match the Tone
Formal for traditional industries, slightly more casual for startups and creative fields.

### Use Keywords
Include relevant keywords from the job description naturally in your letter.

## Common Cover Letter Mistakes

- Being too generic
- Repeating your resume exactly
- Focusing on what you want instead of what you offer
- Being too long or too short
- Forgetting to proofread

## Sample Opening Lines

**For Career Changes**: "While my background is in finance, my passion for user experience design has led me to complete Google's UX certification and build a portfolio of projects..."

**For Recent Graduates**: "As a recent Marketing graduate with internship experience at two tech startups, I'm excited to bring fresh perspectives and digital-native insights to..."

**For Senior Professionals**: "With 15 years of progressive leadership experience in healthcare administration, I'm drawn to [Company's] mission of revolutionizing patient care through technology..."

## Final Thoughts

Your cover letter is your chance to make a personal connection and stand out from other qualified candidates. Take the time to craft a compelling narrative that shows not just what you've done, but who you are as a professional.

**Pro Tip**: Use Proofly's cover letter generator to create a strong foundation, then customize it for each application.
    `,
    author: 'Proofly Team',
    publishDate: '2025-01-04',
    readTime: 7,
    category: 'career-advice',
    tags: ['Cover Letter', 'Job Application', 'Writing Tips', 'Career Advice'],
    featured: false
  }
];

export default function BlogPage() {
  // Derived data
  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.filter(post => !post.featured).slice(0, 4);
  
  const categories = {
    'resume-tips': { name: 'Resume Tips', color: 'bg-blue-100 text-blue-800' },
    'career-advice': { name: 'Career Advice', color: 'bg-green-100 text-green-800' },
    'interview': { name: 'Interview', color: 'bg-purple-100 text-purple-800' },
    'ats-optimization': { name: 'ATS Optimization', color: 'bg-orange-100 text-orange-800' },
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://proofly.com/#website",
        "url": "https://proofly.com/",
        "name": "Proofly",
        "description": "Free Professional CV Builder and Resume Tools",
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://proofly.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "Blog",
        "@id": "https://proofly.com/blog/#blog",
        "url": "https://proofly.com/blog",
        "name": "Proofly Resume & Career Blog",
        "description": "Expert resume writing tips, ATS optimization strategies, interview advice, and career guidance",
        "publisher": {
          "@type": "Organization",
          "@id": "https://proofly.com/#organization"
        },
        "blogPost": blogPosts.map(post => ({
          "@type": "BlogPosting",
          "@id": `https://proofly.com/blog/${post.id}`,
          "url": `https://proofly.com/blog/${post.id}`,
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.publishDate,
          "dateModified": post.publishDate,
          "author": {
            "@type": "Person",
            "name": post.author
          },
          "publisher": {
            "@type": "Organization",
            "@id": "https://proofly.com/#organization"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://proofly.com/blog/${post.id}`
          },
          "keywords": post.tags.join(", "),
          "articleSection": post.category
        }))
      },
      {
        "@type": "Organization",
        "@id": "https://proofly.com/#organization",
        "name": "Proofly",
        "url": "https://proofly.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://proofly.com/logo.png"
        },
        "description": "Free Professional CV Builder and Resume Tools",
        "sameAs": [
          "https://twitter.com/proofly",
          "https://linkedin.com/company/proofly"
        ]
      }
    ]
  };

  return (
    <AppLayout>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resume & Career <span className="text-blue-600">Advice</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Expert tips, proven strategies, and actionable advice to help you land your dream job
            </p>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[post.category].color}`}>
                          {categories[post.category].name}
                        </span>
                        <span className="text-sm text-gray-500">{post.readTime} min read</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
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
