import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import AppLayout from '../../../components/layout/AppLayout';
import Link from 'next/link';

interface BlogPost {
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

// This would normally come from a CMS or database
const blogPosts: BlogPost[] = [
  {
    id: 'ats-resume-optimisation-2025',
    title: '10 ATS Resume Optimisation Tips That Actually Work in 2025',
    excerpt: 'Learn the latest strategies to make your resume ATS-friendly while still appealing to human recruiters.',
    content: `
# 10 ATS Resume Optimisation Tips That Actually Work in 2025

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

## 4. Optimise Your Professional Summary

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

Include both versions: "Search Engine Optimisation (SEO)"

## 8. Avoid Tables and Columns

ATS may not read these correctly. Use simple formatting.

## 9. Test Your Resume

Use tools like Proofly's ATS checker to identify potential issues.

## 10. Tailor for Each Application

Customise your resume for each position, focusing on the most relevant keywords and experiences.

**Remember**: Your resume needs to pass both ATS screening AND impress human recruiters. Balance optimisation with readability.
    `,
    author: 'Proofly Team',
    publishDate: '2025-01-06',
    readTime: 8,
    category: 'ats-optimisation',
    tags: ['ATS', 'Resume Optimisation', 'Job Search', 'Career Tips'],
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

**Why It Fails**: These words minimise your contributions and lack impact.

**The Fix**: Use strong action verbs: Led, Developed, Achieved, Implemented, Optimised

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

### Customise for Each Application
Never use a generic cover letter. Research the company and role to customise your approach.

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

**For Senior Professionals**: "With 15 years of progressive leadership experience in healthcare administration, I'm drawn to [Company's] mission of revolutionising patient care through technology..."

## Final Thoughts

Your cover letter is your chance to make a personal connection and stand out from other qualified candidates. Take the time to craft a compelling narrative that shows not just what you've done, but who you are as a professional.

**Pro Tip**: Use Proofly's cover letter generator to create a strong foundation, then customise it for each application.
    `,
    author: 'Proofly Team',
    publishDate: '2025-01-04',
    readTime: 7,
    category: 'career-advice',
    tags: ['Cover Letter', 'Job Application', 'Writing Tips', 'Career Advice'],
    featured: false
  }
];

// Metadata generation function
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(p => p.id === params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Proofly Blog',
      description: 'The requested blog post could not be found.',
    };
  }

  return {
    title: `${post.title} | Proofly Blog`,
    description: post.excerpt,
    keywords: post.tags,
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
      section: post.category,
      tags: post.tags,
      images: [
        {
          url: `/og-blog-${post.id}.png`,
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
      images: [`/og-blog-${post.id}.png`],
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
    alternates: {
      canonical: `https://proofly.com/blog/${post.id}`,
    },
  };
}

interface BlogPostPageProps {
  params: { slug: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = blogPosts.find(p => p.id === params.slug);

  if (!post) {
    notFound();
  }

  // Convert markdown-like content to JSX (simplified)
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-gray-900 mb-6 mt-8">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-gray-900 mb-4 mt-8">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-bold text-gray-900 mb-3 mt-6">{line.substring(4)}</h3>;
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="mb-4 text-gray-700 leading-relaxed">
              {parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part)}
            </p>
          );
        }
        
        // Bullet points
        if (line.startsWith('- ')) {
          return <li key={index} className="mb-2 text-gray-700">{line.substring(2)}</li>;
        }
        
        // Empty lines
        if (line.trim() === '') {
          return <br key={index} />;
        }
        
        // Regular paragraphs
        return <p key={index} className="mb-4 text-gray-700 leading-relaxed">{line}</p>;
      });
  };

  // Categories for styling
  const categories = {
    'resume-tips': { name: 'Resume Tips', color: 'bg-blue-100 text-blue-800' },
    'career-advice': { name: 'Career Advice', color: 'bg-green-100 text-green-800' },
    'interview': { name: 'Interview', color: 'bg-purple-100 text-purple-800' },
    'ats-optimisation': { name: 'ATS Optimisation', color: 'bg-orange-100 text-orange-800' },
  };

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://proofly.com/og-blog-${post.id}.png`,
    "author": {
      "@type": "Person",
      "name": post.author
    },
    "publisher": {
      "@type": "Organisation",
      "name": "Proofly",
      "logo": {
        "@type": "ImageObject",
        "url": "https://proofly.com/logo.png"
      }
    },
    "datePublished": post.publishDate,
    "dateModified": post.publishDate,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://proofly.com/blog/${post.id}`
    },
    "keywords": post.tags.join(", "),
    "articleSection": post.category,
    "wordCount": post.content.split(' ').length,
    "timeRequired": `PT${post.readTime}M`,
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "creativeWorkStatus": "Published"
  };

  return (
    <AppLayout>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span>→</span></li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li><span>→</span></li>
              <li className="text-gray-900">{post.title}</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories[post.category].color}`}>
                {categories[post.category].name}
              </span>
              <span className="text-sm text-gray-500">{post.readTime} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex items-center justify-between py-6 border-t border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">P</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{post.author}</p>
                  <p className="text-sm text-gray-500">{new Date(post.publishDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              {formatContent(post.content)}
            </div>
          </article>

          {/* CTA Section */}
          <section className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Put This Advice Into Action?</h2>
            <p className="text-lg mb-6 opacity-90">
              Build your professional resume with our free CV builder
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/cv"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Build Your CV
              </Link>
              <Link
                href="/cover-letter"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Write Cover Letter
              </Link>
            </div>
          </section>

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to All Articles
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
