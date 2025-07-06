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

        <div className="grid md:grid-cols-1 gap-12">

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
            Remember: Proofly is and always will be 100% Free!
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
