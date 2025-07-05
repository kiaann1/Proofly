import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Proofly\'s mission to help job seekers create professional CVs and land their dream jobs. Discover our story and commitment to free career tools.',
  openGraph: {
    title: 'About Us - Proofly',
    description: 'Learn about Proofly\'s mission to help job seekers create professional CVs and land their dream jobs. Discover our story and commitment to free career tools.',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About Proofly
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Empowering job seekers with professional CV tools that are completely free and accessible to everyone.
          </p>
        </div>

        <div className="space-y-16">
          {/* Mission Section */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed text-lg">
              At Proofly, we believe that everyone deserves access to professional career tools, regardless of their financial situation. 
              We've built a comprehensive CV builder that rivals expensive alternatives, but we keep it completely free because we know 
              that job searching can already be stressful enough without worrying about costs.
            </p>
          </div>

          {/* Why We're Different */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Why We're Different</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">100% Free Forever</h3>
                    <p className="text-gray-600 text-sm">No hidden costs, premium tiers, or subscription fees. Ever.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">No Registration Required</h3>
                    <p className="text-gray-600 text-sm">Start building immediately without creating an account.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Privacy First</h3>
                    <p className="text-gray-600 text-sm">Your data stays in your browser. We don't collect or store personal information.</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">ATS Optimised</h3>
                    <p className="text-gray-600 text-sm">Built with applicant tracking systems in mind for better job success.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Career Advice</h3>
                    <p className="text-gray-600 text-sm">Actionable tips and guidance from career professionals.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Continuously Improving</h3>
                    <p className="text-gray-600 text-sm">Regular updates based on user feedback and industry trends.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Our Commitment */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Our Commitment to You</h2>
            <p className="text-blue-100 text-lg leading-relaxed mb-6">
              We're committed to keeping Proofly free and accessible to everyone. Our goal is simple: 
              help as many people as possible land their dream jobs with professional CVs and career tools.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-blue-100 text-sm">CVs Created</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">95%</div>
                <div className="text-blue-100 text-sm">ATS Pass Rate</div>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-lg p-4">
                <div className="text-2xl font-bold text-white">100%</div>
                <div className="text-blue-100 text-sm">Free Forever</div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions or Feedback?</h2>
            <p className="text-gray-600 mb-6">
              We'd love to hear from you! Whether you have questions, suggestions, or just want to share your success story.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get in Touch
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
