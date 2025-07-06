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

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
