import { useEffect } from "react";

const Terms = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Terms of Service</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-3xl">
          <p>
            By accessing and using this website, you agree to the following terms. If you do not agree,
            please do not use the site.
          </p>
          <h2>Use of the website</h2>
          <p>
            You may use the website for lawful purposes related to viewing job opportunities and
            submitting applications.
          </p>
          <h2>Applications</h2>
          <p>
            Information submitted through application forms should be accurate and truthful. We may
            reject applications that contain misleading information.
          </p>
          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the site indicates acceptance
            of the updated terms.
          </p>
          <h2>Contact</h2>
          <p>
            For support, contact{" "}
            <a href="mailto:support@careeropportunitiesportal.site">support@careeropportunitiesportal.site</a>.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Terms;
