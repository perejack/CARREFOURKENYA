import { useEffect } from 'react';

const OrganizationSchema = () => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Carrefour Kenya",
      "alternateName": "Carrefour Kenya Careers",
      "url": "https://www.carefourjobopportunities.site",
      "logo": "https://www.carefourjobopportunities.site/favicon.ico",
      "description": "Carrefour Kenya is a leading retailer offering exciting career opportunities across Kenya with competitive salaries, medical benefits, and professional growth opportunities.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "KE"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Human Resources",
        "availableLanguage": ["English", "Swahili"]
      },
      "sameAs": [
        "https://www.carefourjobopportunities.site"
      ]
    };

    // Create or update script tag
    let scriptTag = document.getElementById('organization-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'organization-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('organization-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return null;
};

export default OrganizationSchema;
