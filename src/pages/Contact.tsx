import { useEffect } from "react";

const Contact = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <section className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mb-8">
          For questions about job opportunities or applications, please use the application form on the
          homepage. If you need additional support, you can reach us using the contact details below.
        </p>

        <div className="rounded-lg border border-border bg-card p-6 max-w-3xl">
          <div className="space-y-3 text-foreground">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              <a className="text-primary underline" href="mailto:support@careeropportunitiesportal.site">
                support@careeropportunitiesportal.site
              </a>
            </p>
            <p>
              <span className="font-semibold">Hours:</span> Monday-Friday, 9:00-17:00 (EAT)
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
