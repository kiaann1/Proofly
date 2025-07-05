import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Proofly team. We\'re here to help with your CV building and career development questions.',
  openGraph: {
    title: 'Contact Us - Proofly',
    description: 'Get in touch with the Proofly team. We\'re here to help with your CV building and career development questions.',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about Proofly? We're here to help you succeed in your career journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600">support@proofly.com</p>
                  <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Chat</h3>
                  <p className="text-gray-600">Available Mon-Fri, 9 AM - 6 PM EST</p>
                  <p className="text-sm text-gray-500 mt-1">Get instant help with your CV questions</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Social Media</h3>
                  <p className="text-gray-600">@proofly on Twitter & LinkedIn</p>
                  <p className="text-sm text-gray-500 mt-1">Follow us for career tips and updates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Help */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Help</h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">📋 CV Building Issues</h3>
                <p className="text-blue-800 text-sm">
                  Check our <a href="/#faq" className="underline hover:no-underline">FAQ section</a> for common CV building questions and solutions.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-900 mb-2">🔍 ATS Analysis Help</h3>
                <p className="text-green-800 text-sm">
                  Learn how to interpret ATS scores and improve your CV with our <a href="/blog" className="underline hover:no-underline">career advice blog</a>.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-purple-900 mb-2">💼 Career Guidance</h3>
                <p className="text-purple-800 text-sm">
                  Browse our <a href="/blog?category=resume-advice" className="underline hover:no-underline">resume advice articles</a> for expert tips on landing your dream job.
                </p>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="font-semibold text-orange-900 mb-2">🐛 Technical Issues</h3>
                <p className="text-orange-800 text-sm">
                  Experiencing technical problems? Email us at support@proofly.com with details about the issue.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Reminder */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Remember: Proofly is 100% Free!
          </h2>
          <p className="text-blue-100 mb-6">
            No registration required, no hidden fees, and unlimited access to all features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/cv" 
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Start Building CV
            </a>
            <a 
              href="/ats" 
              className="inline-flex items-center px-6 py-3 bg-transparent text-white border-2 border-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Try ATS Checker
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
