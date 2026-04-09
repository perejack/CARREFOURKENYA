import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApplicationModal } from '@/components/ApplicationModal';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import JobPostingSchema from '@/components/JobPostingSchema';
import { getJobBySlug, getJobsByCategory, EnhancedJobListing } from '@/data/enhancedJobListings';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Heart,
  Calendar,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';

const JobDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<EnhancedJobListing | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<EnhancedJobListing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      const foundJob = getJobBySlug(slug);
      if (foundJob) {
        setJob(foundJob);
        // Get related jobs from same category
        const related = getJobsByCategory(foundJob.categorySlug)
          .filter(j => j.id !== foundJob.id)
          .slice(0, 3);
        setRelatedJobs(related);
      } else {
        navigate('/');
      }
    }
  }, [slug, navigate]);

  if (!job) {
    return null;
  }

  const breadcrumbItems = [
    { name: 'Jobs', url: '/#jobs' },
    { name: job.category, url: `/jobs/category/${job.categorySlug}` },
    { name: job.title, url: `/jobs/${job.slug}` }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema items={breadcrumbItems.map(item => ({
        name: item.name,
        url: `https://www.careeropportunitiesportal.site${item.url}`
      }))} />
      <JobPostingSchema job={job} />

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="secondary" className="mb-3">
                      <Briefcase className="w-3 h-3 mr-1" />
                      {job.category}
                    </Badge>
                    <CardTitle className="text-3xl md:text-4xl mb-4">
                      {job.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-4 text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.employmentType.replace('_', ' ')}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Posted: {new Date(job.datePosted).toLocaleDateString('en-KE', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-secondary/10 rounded-lg mb-6">
                  <div className="flex-1">
                    <div className="flex items-center text-secondary mb-1">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Salary</span>
                    </div>
                    <p className="text-2xl font-bold">{job.salary}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center text-secondary mb-1">
                      <Heart className="w-5 h-5 mr-2" />
                      <span className="font-semibold">Medical Allowance</span>
                    </div>
                    <p className="text-2xl font-bold">{job.medical}</p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>

                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-secondary hover:bg-secondary/90"
                  onClick={() => setIsModalOpen(true)}
                >
                  Apply for this Position
                  <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this Role</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Key Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements & Qualifications</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-secondary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Apply CTA */}
            <Card className="bg-secondary text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Join Our Team?</h3>
                <p className="mb-4 text-white/90">
                  Don't miss this opportunity to build your career with Kenya's leading retailer.
                </p>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="bg-white text-secondary hover:bg-white/90"
                  onClick={() => setIsModalOpen(true)}
                >
                  Apply Now
                  <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Apply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Position</p>
                  <p className="font-semibold">{job.title}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Location</p>
                  <p className="font-semibold">{job.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Salary</p>
                  <p className="font-semibold">{job.salary}/month</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Application Deadline</p>
                  <p className="font-semibold">
                    {new Date(job.validThrough).toLocaleDateString('en-KE', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90"
                  onClick={() => setIsModalOpen(true)}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Positions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <Link
                      key={relatedJob.id}
                      to={`/jobs/${relatedJob.slug}`}
                      className="block p-3 rounded-lg border border-border hover:border-secondary hover:shadow-md transition-all"
                    >
                      <p className="font-semibold text-foreground mb-1">
                        {relatedJob.title}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {relatedJob.category}
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {relatedJob.salary}/month
                      </p>
                    </Link>
                  ))}
                  <Link to="/#jobs">
                    <Button variant="outline" className="w-full">
                      View All Jobs
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
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
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobDetail;
