import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-3xl mx-auto glass-panel p-8">
        <Link href="/" className="flex items-center gap-2 text-accent mb-6 hover:underline">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6 text-gradient">Privacy Policy</h1>
        <p className="text-gray-400 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Introduction</h2>
            <p>
              Welcome to CreatorOS ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy.
              This Privacy Policy explains how we collect, use, and share your information when you use our website and services, including our integration with social media platforms like YouTube and Instagram.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, connect a social media profile, or contact us for support.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Account Information:</strong> Name, email address, profile picture.</li>
                <li><strong>Connected Accounts:</strong> When you link YouTube or Instagram, we access public profile data (followers, view counts) and insights (impressions, reach) via their official APIs.</li>
                <li><strong>Usage Data:</strong> Information about how you use our website.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. How We Use Your Information</h2>
            <p>We use your information to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Provide, operate, and maintain our Service.</li>
                <li>Improve, personalize, and expand our Service.</li>
                <li>Analyze engagement trends to provide AI-powered growth insights.</li>
                <li>Send you updates, security alerts, and support messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Sharing Your Information</h2>
            <p>
              We do not sell your personal information. We may share detailed analytics or insights only with you. 
              We may share data with third-party vendors (like database hosting) solely for the purpose of operating the Service.
            </p>
          </section>
          
           <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Data Retention</h2>
            <p>
              We retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy.
              You can request deletion of your data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at support@creatoros.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
