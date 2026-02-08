import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      <div className="max-w-3xl mx-auto glass-panel p-8">
        <Link href="/" className="flex items-center gap-2 text-accent mb-6 hover:underline">
          <ArrowLeft size={20} /> Back to Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-6 text-gradient">Terms of Service</h1>
        <p className="text-gray-400 mb-4">Last Updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing usage of CreatorOS, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">2. Use of Service</h2>
            <p>
              CreatorOS provides analytics and AI insights for content creators. You agree to use the Service only for lawful purposes and in accordance with these Terms.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>You must be at least 13 years old to use the Service.</li>
                <li>You are responsible for maintaining the security of your account.</li>
                <li>You agree not to misuse or interfere with the Service's manufacturing or operations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">3. Third-Party Services</h2>
            <p>
               Our Service integrates with third-party platforms like YouTube (Google) and Instagram (Meta). 
               By using these integrations, you agree to be bound by the YouTube Terms of Service and Meta Terms of Service, respectively.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">4. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are and will remain the exclusive property of CreatorOS and its licensors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">5. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-2">6. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at support@creatoros.app.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
