import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Proofly\'s privacy policy - learn how we protect your data and respect your privacy when using our free CV builder.',
  openGraph: {
    title: 'Privacy Policy - Proofly',
    description: 'Proofly\'s privacy policy - learn how we protect your data and respect your privacy when using our free CV builder.',
  },
};

export default function PrivacyPage() {
  const lastUpdated = 'July 2025';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-3">🔒 Privacy First Approach</h2>
              <p className="text-blue-800 mb-0">
                At Proofly, we believe your personal information should stay personal. That's why we've designed our platform to work entirely in your browser, without storing your CV data on our servers.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Don't Collect</h2>
            <p style={{ color: 'black' }}>Unlike many other services, Proofly deliberately avoids collecting personal information:</p>
            <ul>
              <li style={{ color: 'black' }}><strong>CV Content:</strong> Your CV data (name, experience, education, etc.) is stored locally in your browser only</li>
              <li style={{ color: 'black' }}><strong>Personal Details:</strong> We don't require registration, so we don't collect names, emails, or phone numbers</li>
              <li style={{ color: 'black' }}><strong>File Uploads:</strong> When you upload files for ATS analysis, they're processed in your browser and not stored on our servers</li>
              <li style={{ color: 'black' }}><strong>User Accounts:</strong> We don't create user accounts or profiles</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Do Collect</h2>
            <p style={{ color: 'black' }}>We only collect minimal, anonymous information to improve our service:</p>
            <ul>
              <li style={{ color: 'black' }}><strong>Analytics:</strong> Basic website usage statistics (page views, general location data) through privacy-focused analytics</li>
              <li style={{ color: 'black' }}><strong>Error Logs:</strong> Technical error information to help us fix bugs and improve performance</li>
              <li style={{ color: 'black' }}><strong>Browser Information:</strong> Basic browser and device information for compatibility purposes</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How Your Data is Stored</h2>
            <p style={{ color: 'black' }}>Your CV information is stored using browser local storage, which means:</p>
            <ul>
              <li style={{ color: 'black' }}>Data stays on your device and is never transmitted to our servers</li>
              <li style={{ color: 'black' }}>Only you have access to your CV information</li>
              <li style={{ color: 'black' }}>Data persists between sessions on the same browser and device</li>
              <li style={{ color: 'black' }}>You can clear this data at any time through your browser settings</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
            <p style={{ color: 'black' }}>We use a limited number of third-party services that may process some data:</p>
            <ul>
              <li style={{ color: 'black' }}><strong>Analytics:</strong> Privacy-focused analytics to understand how our site is used</li>
              <li style={{ color: 'black' }}><strong>CDN Services:</strong> Content delivery networks to serve our website faster</li>
              <li style={{ color: 'black' }}><strong>Error Tracking:</strong> Services to help us identify and fix technical issues</li>
            </ul>
            <p style={{ color: 'black' }}>These services do not have access to your CV content or personal information.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies and Tracking</h2>
            <p style={{ color: 'black' }}>We use minimal cookies and tracking:</p>
            <ul>
              <li style={{ color: 'black' }}><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li style={{ color: 'black' }}><strong>Analytics Cookies:</strong> Anonymous usage statistics (you can opt-out)</li>
              <li style={{ color: 'black' }}><strong>No Advertising Cookies:</strong> We don't use advertising or marketing cookies</li>
              <li style={{ color: 'black' }}><strong>No Cross-Site Tracking:</strong> We don't track you across other websites</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Data Security</h2>
            <p style={{ color: 'black' }}>We implement industry-standard security measures:</p>
            <ul>
              <li style={{ color: 'black' }}>HTTPS encryption for all website traffic</li>
              <li style={{ color: 'black' }}>Regular security updates and monitoring</li>
              <li style={{ color: 'black' }}>Minimal data collection reduces potential security risks</li>
              <li style={{ color: 'black' }}>No central database of personal information to be compromised</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Your Rights</h2>
            <p style={{ color: 'black' }}>Since we don't store your personal data, most traditional data rights aren't applicable, but you can:</p>
            <ul>
              <li style={{ color: 'black' }}>Clear your CV data at any time through your browser settings</li>
              <li style={{ color: 'black' }}>Opt-out of analytics tracking</li>
              <li style={{ color: 'black' }}>Contact us with any privacy questions or concerns</li>
              <li style={{ color: 'black' }}>Request information about what anonymous data we collect</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">International Users</h2>
            <p style={{ color: 'black' }}>Proofly is available worldwide. Since your data is stored locally on your device, there are no international data transfer concerns. Our servers are located in secure data centers and comply with international privacy standards.</p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
            <p style={{ color: 'black' }}>We may update this privacy policy occasionally to reflect changes in our practices or legal requirements. We'll notify users of significant changes by updating the "Last updated" date at the top of this page.</p>


            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Our Promise</h3>
              <p className="text-green-800 mb-0">
                We will never sell, rent, or share your personal information with third parties for marketing purposes. 
                Your privacy is fundamental to our mission of providing free, accessible career tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
