import { useEffect } from "react";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-3xl">
          <p>
            This Privacy Policy explains how we collect, use, and protect personal information when you
            use this website and submit a job application.
          </p>
          <h2>Information we collect</h2>
          <p>
            We may collect information you provide when applying for a role, including your name,
            contact details, work history, and any other information you submit through our forms.
          </p>
          <h2>How we use your information</h2>
          <p>
            We use your information to process applications, communicate with you, and improve the
            website experience.
          </p>
          <h2>Data retention</h2>
          <p>
            We retain submitted information for as long as necessary to evaluate applications and for
            legitimate business or legal purposes.
          </p>
          <h2>Contact</h2>
          <p>
            If you have questions, contact us at{" "}
            <a href="mailto:support@careeropportunitiesportal.site">support@careeropportunitiesportal.site</a>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Privacy;
