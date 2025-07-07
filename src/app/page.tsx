import { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Free Professional CV Builder - Create ATS-optimised Resumes | Proofly',
  description: 'Build professional CVs that get you hired faster. Free ATS-optimised resume builder with templates, cover letter generator, and career advice. No registration required.',
  keywords: [
    'free CV builder', 'professional resume builder', 'ATS optimised CV', 'resume templates',
    'cover letter generator', 'free resume maker', 'job application tools', 'career advice',
    'professional CV templates', 'ATS friendly resume', 'online CV builder', 'resume creator'
  ],
  openGraph: {
    title: 'Free Professional CV Builder - Create ATS-optimised Resumes | Proofly',
    description: 'Build professional CVs that get you hired faster. Free ATS-optimised resume builder with templates, cover letter generator, and career advice. No registration required.',
    url: 'https://proofly.com',
    images: [
      {
        url: '/og-home.png',
        width: 1200,
        height: 630,
        alt: 'Proofly - Free Professional CV Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Professional CV Builder - Create ATS-optimised Resumes | Proofly',
    description: 'Build professional CVs that get you hired faster. Free ATS-optimised resume builder with templates, cover letter generator, and career advice. No registration required.',
    images: ['/og-home.png'],
  },
  alternates: {
    canonical: 'https://proofly.com',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 lg:pt-24 pb-16 sm:pb-20 lg:pb-28">
          <div className="text-center">            
            {/* Badge */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
                </svg>
                #1 ATS-Optimised CV Builder
              </div>
              <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-bold border-2 border-green-200">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414-1.414L9 5.586 7.707 4.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4a1 1 0 00-1.414-1.414z" clipRule="evenodd" />
                </svg>
                100% FREE FOREVER
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Build CVs that get you
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                hired faster
              </span>
            </h1>            
            
            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
              Create professional, ATS-optimised CVs in minutes. Our intelligent platform analyses your CV against job requirements and optimises it for success.
            </p>
            
            {/* Free Features Highlight */}
            <div className="bg-white/80 backdrop-blur rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto mb-8 sm:mb-12 border border-gray-200 shadow-lg mx-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">🎉 Everything is 100% Free - No Hidden Costs!</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm text-gray-700">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Unlimited CV builds
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  All professional templates
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  ATS analysis & tips
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  PDF & DOCX exports
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cover letter generator
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  No account required
                </div>
              </div>
            </div>            
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
              <Link 
                href="/cv" 
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Start Building CV for Free
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link 
                href="/cover-letter" 
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-green-600 hover:bg-green-700 text-white text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Create Cover Letter
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </Link>
              <Link 
                href="/ats" 
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-gray-900 text-base sm:text-lg font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg border border-gray-200 hover:border-gray-300"
              >
                Analyse Existing CV
                <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-8 text-gray-500 px-4">
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-bold text-blue-600">10K+</span>
                <span className="ml-2 text-sm">CVs Created</span>
              </div>
              <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-bold text-green-600">95%</span>
                <span className="ml-2 text-sm">ATS Pass Rate</span>
              </div>
              <div className="w-px h-8 bg-gray-300 hidden sm:block"></div>
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-bold text-purple-600">4.9★</span>
                <span className="ml-2 text-sm">User Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Proofly?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              The complete toolkit for modern job seekers
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="group relative bg-gradient-to-br from-white to-blue-50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Smart CV Builder</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Create professional CVs with our intelligent builder. Choose from expertly designed templates and get real-time suggestions.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['Professional templates', 'Live preview & editing', 'Auto-save functionality', 'Multiple export formats'].map((feature, index) => (
                    <li key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative bg-gradient-to-br from-white to-purple-50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">ATS Optimisation</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Ensure your CV passes through Applicant Tracking Systems with our advanced analysis engine and smart recommendations.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['Upload & analyse existing CVs', 'Keyword optimisation', 'Format compatibility check', 'Actionable improvement tips'].map((feature, index) => (
                    <li key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-500 rounded-full mr-2 sm:mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Export & Share</h3>
                <p className="text-gray-600 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                  Download your perfected CV in multiple formats, ready for any application. Share with confidence.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  {['High-quality PDF export', 'Microsoft Word format', 'ATS-friendly formatting', 'Instant download'].map((feature, index) => (
                    <li key={index} className="flex items-center text-xs sm:text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 sm:mb-10 leading-relaxed">
            Join thousands of professionals who've upgraded their careers with Proofly. Start building your perfect CV today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link 
              href="/cv" 
              className="group inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-white text-blue-600 text-lg sm:text-xl font-semibold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Get Started Now
              <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/ats" 
              className="group inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 bg-transparent text-white text-lg sm:text-xl font-semibold rounded-2xl border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Try ATS Checker
              <svg className="w-5 h-5 sm:w-6 sm:h-6 ml-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </Link>
          </div>
        </div>
      </section>      
      
      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              Everything you need to know about our free CV builder
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    Is Proofly really 100% free to use?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Yes, absolutely! Proofly is completely free to use with no hidden costs, premium features, or subscription fees. You can create unlimited CVs, access all templates, use the ATS checker, generate cover letters, and export in multiple formats without paying anything.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    Do I need to create an account to use Proofly?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    No registration required! You can start building your CV immediately without creating an account. Your data is automatically saved in your browser's local storage, so you can continue working on your CV anytime you return to the site.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    What does ATS-optimised mean?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    ATS (Applicant Tracking System) optimisation means your CV is formatted to be easily read by the software that 98% of large companies use to screen resumes. Our templates use proper formatting, standard section headers, and compatible fonts to ensure your CV passes through these systems and reaches human recruiters.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    What file formats can I export my CV in?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    You can export your CV in both PDF and Microsoft Word (DOCX) formats. PDF is perfect for email attachments and online applications, while DOCX format allows for easy editing and is preferred by some employers.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    How does the ATS checker work?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Our ATS checker analyses your CV against job descriptions to identify missing keywords, formatting issues, and optimisation opportunities. You can upload an existing CV or use our built-in checker while building your CV. It provides actionable suggestions to improve your chances of passing ATS screening.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    Can I customise the CV templates?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Absolutely! Our CV builder includes a comprehensive styling system where you can customise fonts, colors, sizes, and layout elements. You can see changes in real-time with our live preview feature while maintaining ATS compatibility.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 7 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    Is my personal data secure?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Yes, your privacy is our priority. All your CV data is stored locally in your browser and never transmitted to our servers unless you explicitly choose to save or export. We don't collect, store, or share your personal information.
                  </p>
                </div>
              </details>
            </div>

            {/* FAQ Item 8 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                    What makes Proofly different from other CV builders?
                  </h3>
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Proofly is completely free with no limitations, includes advanced ATS optimisation, offers professional cover letter generation, provides grammar and style checking, and requires no registration. Most importantly, we focus on helping you land interviews, not just creating pretty documents.
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* FAQ CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Still have questions? Check out our 
              <Link href="/blog" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                career advice blog
              </Link>
              {' '}for more tips and guidance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
