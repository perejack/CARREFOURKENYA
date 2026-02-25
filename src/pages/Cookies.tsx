import { useEffect } from "react";

const Cookies = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Cookie Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-3xl">
          <p>
            This website may use cookies and similar technologies to improve performance, measure
            traffic, and enhance your browsing experience.
          </p>
          <h2>What are cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help websites remember information
            about your visit.
          </p>
          <h2>How we use cookies</h2>
          <p>
            We may use cookies for basic site functionality, analytics, and to understand how users
            interact with our pages.
          </p>
          <h2>Managing cookies</h2>
          <p>
            You can control cookies through your browser settings. Disabling cookies may affect some
            website features.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Cookies;
