import React from "react";

const PrivacyPolicyComp = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-8 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6">Privacy Policy</h1>
        <p className="text-center text-sm text-gray-500 mb-8">Effective Date: July 10, 2025</p>

        <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">1. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Full name, email, profile image</li>
              <li>Bio, designation, skill tags</li>
              <li>Chat messages and reviews</li>
              <li>Device information and user activity</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and manage your account</li>
              <li>To display your skills and profile</li>
              <li>To enable messaging and community interaction</li>
              <li>To improve security and functionality</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">3. Data Sharing</h2>
            <p>
              We <strong>do not sell</strong> your personal data. We only share data with:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-1">
              <li>Other users (for collaboration)</li>
              <li>Admins and moderators (for management)</li>
              <li>Legal authorities (when required)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">4. Cookies</h2>
            <p>
              We use cookies to maintain login sessions, track analytics, and personalize your experience.
              You can manage cookies via your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">5. Data Security</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Encrypted passwords using bcrypt</li>
              <li>Secure HTTPS connections</li>
              <li>Email verification for new accounts</li>
              <li>Strict admin role-based controls</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">6. Your Rights</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Edit or delete your profile anytime</li>
              <li>Withdraw or deactivate your account</li>
              <li>Contact us to raise concerns or report misuse</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">7. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Users will be notified via email or
              system notifications for any significant changes.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-indigo-600 mb-2">8. Contact Us</h2>
            <p>
              For questions or concerns, reach out to:
              <br />
              📧 <a href="mailto:support@skillswap.com" className="text-blue-600 hover:underline">support@skillswap.com</a>
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-gray-400">© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyComp;
