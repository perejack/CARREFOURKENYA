import { useEffect } from 'react';
import { EnhancedJobListing } from '@/data/enhancedJobListings';

interface JobPostingSchemaProps {
  job: EnhancedJobListing;
}

const JobPostingSchema = ({ job }: JobPostingSchemaProps) => {
  useEffect(() => {
    const schema = {
      "@context": "https://schema.org/",
      "@type": "JobPosting",
      "title": `${job.title} at Carrefour Kenya`,
      "description": `${job.description}\n\nKey Responsibilities:\n${job.responsibilities.join('\n')}\n\nRequirements:\n${job.requirements.join('\n')}\n\nBenefits:\n${job.benefits.join('\n')}`,
      "identifier": {
        "@type": "PropertyValue",
        "name": "Carrefour Kenya",
        "value": job.id
      },
      "datePosted": job.datePosted,
      "validThrough": `${job.validThrough}T23:59:59+03:00`,
      "employmentType": job.employmentType,
      "hiringOrganization": {
        "@type": "Organization",
        "name": "Carrefour Kenya",
        "sameAs": "https://www.careeropportunitiesportal.site",
        "logo": "https://www.careeropportunitiesportal.site/favicon.ico"
      },
      "jobLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrefour Kenya",
          "addressLocality": job.location.split(',')[0].trim(),
          "addressRegion": "Nairobi",
          "addressCountry": "KE"
        }
      },
      "baseSalary": {
        "@type": "MonetaryAmount",
        "currency": "KES",
        "value": {
          "@type": "QuantitativeValue",
          "value": job.salaryAmount,
          "unitText": "MONTH"
        }
      },
      "jobBenefits": `Medical allowance of ${job.medical} per month, staff discounts, career growth opportunities, professional training and development programs`,
      "qualifications": job.requirements.join('; '),
      "responsibilities": job.responsibilities.join('; ')
    };

    // Create or update script tag
    let scriptTag = document.getElementById('job-posting-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'job-posting-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schema);

    // Cleanup on unmount
    return () => {
      const existingScript = document.getElementById('job-posting-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [job]);

  return null;
};

export default JobPostingSchema;
