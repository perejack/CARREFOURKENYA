import { useEffect } from "react";

const Policy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Advertising & Site Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-3xl">
          <p className="text-lg text-muted-foreground mb-8">
            This page outlines our advertising practices, site policies, and compliance guidelines 
            to ensure transparency and trust with all users and advertising partners.
          </p>

          <h2>Contact Information</h2>
          <p>
            We maintain transparent and accessible contact information for all inquiries:
          </p>
          <ul>
            <li><strong>Business Name:</strong> Carrefour Kenya Careers Portal</li>
            <li><strong>Physical Address:</strong> 209 Lenana Road, Nairobi, Kenya</li>
            <li><strong>Phone:</strong> <a href="tel:+254105575260">+254 105 575 260</a></li>
            <li><strong>Email:</strong> <a href="mailto:support@careeropportunitiesportal.site">support@careeropportunitiesportal.site</a></li>
            <li><strong>Business Hours:</strong> Monday-Friday, 9:00-17:00 (EAT)</li>
          </ul>

          <h2>About Our Service</h2>
          <p>
            This website is an independent job portal connecting job seekers with employment 
            opportunities at Carrefour Kenya. We facilitate the application process but do not 
            guarantee employment. All hiring decisions are made by Carrefour Kenya's HR department.
          </p>

          <h2>Advertising Practices</h2>
          <p>
            We adhere to Google Ads policies and industry best practices:
          </p>
          <ul>
            <li>All job listings are verified and legitimate positions</li>
            <li>We do not promote misleading or deceptive content</li>
            <li>Application fees are clearly disclosed and fully refundable for unsuccessful applicants</li>
            <li>We do not make false promises regarding employment outcomes</li>
            <li>All advertised benefits and salaries are accurate representations</li>
          </ul>

          <h2>Data Collection & Privacy</h2>
          <p>
            We collect only necessary information for job application purposes:
          </p>
          <ul>
            <li>Personal identification information (name, contact details)</li>
            <li>Professional qualifications and work history</li>
            <li>Application preferences and job interests</li>
          </ul>
          <p>
            We do not sell personal data to third parties. Data is shared only with Carrefour 
            Kenya's hiring team for recruitment purposes. See our <a href="/privacy">Privacy Policy</a> for complete details.
          </p>

          <h2>User Responsibilities</h2>
          <p>
            By using this site and submitting applications, users agree to:
          </p>
          <ul>
            <li>Provide accurate and truthful information</li>
            <li>Not submit false or misleading application materials</li>
            <li>Be at least 18 years of age</li>
            <li>Be legally eligible to work in Kenya</li>
            <li>Not use automated systems to submit applications</li>
          </ul>

          <h2>Prohibited Content & Activities</h2>
          <p>
            The following are strictly prohibited on this platform:
          </p>
          <ul>
            <li>False, fraudulent, or misleading job listings</li>
            <li>Requests for payment from job seekers</li>
            <li>Discriminatory language or requirements in listings</li>
            <li>Spam, malware, or malicious code</li>
            <li>Impersonation of Carrefour Kenya or its representatives</li>
            <li>Collection of data through unauthorized means</li>
          </ul>

          <h2>Third-Party Links</h2>
          <p>
            This site may contain links to external resources. We are not responsible for the 
            content, privacy practices, or security of third-party websites. Users should review 
            the policies of any external sites before providing personal information.
          </p>

          <h2>Refund & Cancellation Policy</h2>
          <p>
            We charge a nominal application processing fee to ensure serious applicants and maintain 
            the quality of our recruitment services.
          </p>
          <ul>
            <li><strong>Refund Eligibility:</strong> If your application is unsuccessful, your payment is fully refundable.</li>
            <li><strong>Refund Timeline:</strong> Refunds are processed within 7 business days of application rejection notification.</li>
            <li><strong>Refund Method:</strong> Refunds are issued to the original payment method used during application.</li>
            <li><strong>Non-Refundable Cases:</strong> Refunds are not available for fraudulent applications, incomplete submissions, or applications withdrawn by the applicant.</li>
          </ul>
          <p>
            To request a refund, contact our support team with your application reference number. 
            Approved refunds will be processed to your original payment method within 7 days.
          </p>

          <h2>Disclaimer</h2>
          <p>
            While we strive to maintain accurate and up-to-date information, job listings and 
            requirements may change. We do not guarantee that all listed positions remain available. 
            Final hiring decisions rest solely with Carrefour Kenya. This portal operates independently 
            and is not directly affiliated with Carrefour's corporate HR systems.
          </p>

          <h2>Policy Updates</h2>
          <p>
            We may update these policies periodically to reflect changes in regulations, business 
            practices, or advertising platform requirements. Continued use of the site after 
            policy changes constitutes acceptance of the updated terms.
          </p>

          <h2>Reporting Violations</h2>
          <p>
            If you encounter suspicious listings, policy violations, or have concerns about 
            advertising practices, please contact us immediately:
          </p>
          <ul>
            <li>Email: <a href="mailto:support@careeropportunitiesportal.site">support@careeropportunitiesportal.site</a></li>
            <li>Phone: <a href="tel:+254105575260">+254 105 575 260</a></li>
          </ul>

          <h2>Compliance</h2>
          <p>
            We are committed to compliance with:
          </p>
          <ul>
            <li>Google Ads policies and guidelines</li>
            <li>Kenya Data Protection Act, 2019</li>
            <li>Applicable employment and labor laws</li>
            <li>Consumer protection regulations</li>
          </ul>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: April 2025
          </p>
        </div>
      </section>
    </main>
  );
};

export default Policy;
