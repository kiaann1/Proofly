import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Proofly\'s terms of service - understand the terms and conditions for using our free CV builder and career tools.',
  openGraph: {
    title: 'Terms of Service - Proofly',
    description: 'Proofly\'s terms of service - understand the terms and conditions for using our free CV builder and career tools.',
  },
};

export default function TermsPage() {
  const lastUpdated = 'July 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">🤝 Simple Terms</h2>
              <p className="text-blue-800 mb-0">
                These terms are designed to be fair and straightforward. By using Proofly, you agree to these terms, which outline what you can expect from us and what we ask of you.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p style={{ color: 'black' }}>By accessing and using Proofly ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree with these terms, please do not use our service.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
            <p style={{ color: 'black' }}>Proofly provides:</p>
            <ul>
              <li style={{ color: 'black' }}>Free CV and resume building tools</li>
              <li style={{ color: 'black' }}>Cover letter generation services</li>
              <li style={{ color: 'black' }}>ATS (Applicant Tracking System) analysis</li>
              <li style={{ color: 'black' }}>Career advice and resources</li>
              <li style={{ color: 'black' }}>Document export capabilities (PDF, DOCX)</li>
            </ul>
            <p style={{ color: 'black' }}>All services are provided free of charge with no registration required.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
            <p style={{ color: 'black' }}>When using Proofly, you agree to:</p>
            <ul>
              <li style={{ color: 'black' }}><strong>Provide accurate information:</strong> Ensure your CV content is truthful and accurate</li>
              <li style={{ color: 'black' }}><strong>Respect others:</strong> Don't use the service for illegal or harmful purposes</li>
              <li style={{ color: 'black' }}><strong>No abuse:</strong> Don't attempt to overload or damage our systems</li>
              <li style={{ color: 'black' }}><strong>Own your content:</strong> Only include content you have the right to use</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
            <p style={{ color: 'black' }}><strong>Your Content:</strong> You retain full ownership of your CV content, personal information, and any materials you create using Proofly.</p>
            <p style={{ color: 'black' }}><strong>Our Content:</strong> The Proofly platform, templates, design elements, and website content are owned by us and protected by copyright laws.</p>
            <p style={{ color: 'black' }}><strong>Templates:</strong> Our CV templates are free to use for personal and commercial purposes, but you cannot redistribute the templates themselves.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Privacy and Data</h2>
            <p style={{ color: 'black' }}>Your privacy is important to us:</p>
            <ul>
              <li style={{ color: 'black' }}>Your CV data is stored locally in your browser, not on our servers</li>
              <li style={{ color: 'black' }}>We don't require registration or collect personal information</li>
              <li style={{ color: 'black' }}>See our <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a> for complete details</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Service Availability</h2>
            <p style={{ color: 'black' }}>We strive to keep Proofly available 24/7, but:</p>
            <ul>
              <li style={{ color: 'black' }}>We don't guarantee uninterrupted service</li>
              <li style={{ color: 'black' }}>Maintenance and updates may cause temporary downtime</li>
              <li style={{ color: 'black' }}>We may modify or discontinue features with reasonable notice</li>
              <li style={{ color: 'black' }}>Since your data is stored locally, service interruptions won't affect your saved CVs</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Disclaimers</h2>
            <p style={{ color: 'black' }}><strong>No Employment Guarantees:</strong> While we provide tools to help improve your CV, we cannot guarantee job interviews or employment outcomes.</p>
            <p style={{ color: 'black' }}><strong>ATS Analysis:</strong> Our ATS checker provides guidance based on common practices, but different companies may use different systems with varying requirements.</p>
            <p style={{ color: 'black' }}><strong>Career Advice:</strong> Our career advice is for informational purposes and should not be considered professional career counseling.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Limitation of Liability</h2>
            <p style={{ color: 'black' }}>To the fullest extent permitted by law:</p>
            <ul>
              <li style={{ color: 'black' }}>Proofly is provided "as is" without warranties of any kind</li>
              <li style={{ color: 'black' }}>We are not liable for any indirect, incidental, or consequential damages</li>
              <li style={{ color: 'black' }}>Our total liability is limited to the amount you paid us (which is $0 since our service is free)</li>
              <li style={{ color: 'black' }}>You use the service at your own risk</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Prohibited Uses</h2>
            <p style={{ color: 'black' }}>You may not use Proofly to:</p>
            <ul>
              <li style={{ color: 'black' }}>Create false or misleading CVs with fraudulent information</li>
              <li style={{ color: 'black' }}>Attempt to harm or disrupt our service</li>
              <li style={{ color: 'black' }}>Violate any applicable laws or regulations</li>
              <li style={{ color: 'black' }}>Infringe on others' intellectual property rights</li>
              <li style={{ color: 'black' }}>Use the service for any commercial redistribution</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>
            <p style={{ color: 'black' }}>You can stop using Proofly at any time by simply closing your browser. We may terminate or suspend access to users who violate these terms, though we'll generally try to resolve issues through communication first.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
            <p style={{ color: 'black' }}>We may update these terms occasionally to reflect changes in our service or legal requirements. Significant changes will be communicated by updating the "Last updated" date. Continued use of the service after changes constitutes acceptance of the new terms.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
            <p style={{ color: 'black' }}>These terms are governed by the laws of the jurisdiction where Proofly is operated. Any disputes will be resolved in the courts of that jurisdiction.</p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-900 mb-2">🌟 Our Commitment</h3>
              <p className="text-green-800 mb-0">
                These terms are designed to protect both you and us while keeping our service free and accessible. 
                If you have questions or concerns about any of these terms, please don't hesitate to reach out.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
