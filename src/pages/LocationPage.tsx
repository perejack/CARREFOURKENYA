import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { ApplicationModal } from '@/components/ApplicationModal';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { getLocationBySlug, getAllLocations, LocationData } from '@/data/locations';
import { MapPin, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

const LocationPage = () => {
  const { locationSlug } = useParams<{ locationSlug: string }>();
  const navigate = useNavigate();
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (locationSlug) {
      const foundLocation = getLocationBySlug(locationSlug);
      if (foundLocation) {
        setLocationData(foundLocation);
      } else {
        navigate('/');
      }
    }
  }, [locationSlug, navigate]);

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsModalOpen(true);
  };

  if (!locationData) {
    return null;
  }

  const breadcrumbItems = [
    { name: 'Jobs', url: '/#jobs' },
    { name: 'Locations', url: '/jobs/locations' },
    { name: locationData.name, url: `/jobs/location/${locationData.slug}` }
  ];

  const otherLocations = getAllLocations().filter(loc => loc.slug !== locationData.slug);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`Carrefour Kenya Jobs in ${locationData.name} | ${locationData.name} Vacancies`}</title>
        <meta name="description" content={`Find all open Carrefour Kenya job opportunities in ${locationData.name}. Apply for retail, logistics, and management vacancies in ${locationData.name} today.`} />
        <meta name="keywords" content={locationData.keywords} />
      </Helmet>
      <BreadcrumbSchema items={breadcrumbItems.map(item => ({
        name: item.name,
        url: `https://www.careeropportunitiesportal.site${item.url}`
      }))} />

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-secondary">
            Carrefour Kenya Careers
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />

        {/* Location Header */}
        <div className="mt-8 mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-base px-6 py-2">
            <MapPin className="w-4 h-4 mr-2" />
            Jobs in {locationData.name}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Carrefour Kenya Job Opportunities in {locationData.name}
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {locationData.description}
          </p>
          <p className="text-lg font-semibold text-secondary">
            {locationData.jobs.length} {locationData.jobs.length === 1 ? 'Position' : 'Positions'} Available
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {locationData.jobs.map((job) => (
            <div key={job.id}>
              <Link to={`/jobs/${job.slug}`}>
                <JobCard
                  title={job.title}
                  salary={job.salary}
                  medical={job.medical}
                  category={job.category}
                  image={job.image}
                  onApply={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleApply(job.title);
                  }}
                />
              </Link>
            </div>
          ))}
        </div>

        {/* Other Locations */}
        {otherLocations.length > 0 && (
          <div className="py-12 bg-muted/30 rounded-lg">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Explore Jobs in Other Cities
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {otherLocations.map((location) => (
                  <Link
                    key={location.slug}
                    to={`/jobs/location/${location.slug}`}
                    className="p-4 bg-card rounded-lg border border-border hover:border-secondary hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{location.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {location.jobs.length} {location.jobs.length === 1 ? 'position' : 'positions'}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-secondary" />
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/#jobs">
                  <Button size="lg" variant="outline">
                    View All Jobs
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link className="hover:text-foreground" to="/faq">
                FAQ
              </Link>
              <Link className="hover:text-foreground" to="/contact">
                Contact
              </Link>
              <Link className="hover:text-foreground" to="/privacy">
                Privacy
              </Link>
              <Link className="hover:text-foreground" to="/terms">
                Terms
              </Link>
              <Link className="hover:text-foreground" to="/cookies">
                Cookies
              </Link>
            </div>
            <p>© 2025 Carrefour Kenya. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobTitle={selectedJob}
      />
    </div>
  );
};

export default LocationPage;
