import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JobCard } from '@/components/JobCard';
import { ApplicationModal } from '@/components/ApplicationModal';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { getJobsByCategory, getAllCategories, EnhancedJobListing } from '@/data/enhancedJobListings';
import { Briefcase, ArrowRight } from 'lucide-react';

const categoryDescriptions: Record<string, string> = {
  'customer-service': 'Build your career in customer service at Carrefour Kenya. Our customer service roles offer excellent opportunities to develop interpersonal skills, problem-solving abilities, and professional growth in Kenya\'s leading retail environment. Join our team of dedicated professionals who create exceptional shopping experiences for thousands of customers daily.',
  'finance': 'Explore finance and accounting career opportunities at Carrefour Kenya. Our finance department offers roles ranging from cashier positions to accounting specialists, providing hands-on experience in retail financial operations, cash management, and financial reporting in a fast-paced retail environment.',
  'operations': 'Join Carrefour Kenya\'s operations team and be part of the backbone that keeps our stores running smoothly. Operations roles offer diverse opportunities in warehouse management, inventory control, and store operations, with clear career progression paths to senior management positions.',
  'sales-marketing': 'Launch your sales and marketing career with Carrefour Kenya. Our sales and marketing positions combine field work with strategic marketing activities, offering opportunities to develop business development skills, customer relationship management, and marketing expertise in Kenya\'s competitive retail sector.',
  'logistics': 'Drive your career forward in logistics at Carrefour Kenya. Our logistics and transportation roles are essential to our supply chain operations, offering stable employment, competitive compensation, and opportunities to work with modern fleet management and distribution systems.',
  'security': 'Protect and serve with Carrefour Kenya\'s security team. Security positions offer stable employment with a reputable organization, professional training in security management, and opportunities to advance to supervisory roles while ensuring the safety of our customers, staff, and assets.',
  'food-service': 'Showcase your culinary talents at Carrefour Kenya. Our food service department offers exciting opportunities for chefs and food preparation specialists to work in modern kitchen facilities, develop culinary skills, and contribute to our reputation for quality fresh food offerings.',
  'facility-management': 'Join Carrefour Kenya\'s facility management team and play a vital role in maintaining world-class retail environments. Facility management roles offer stable employment, clear advancement opportunities, and the satisfaction of maintaining high standards of cleanliness and presentation.',
  'warehouse': 'Start your warehouse career with Carrefour Kenya. Warehouse positions offer entry-level opportunities with competitive compensation, on-the-job training, and clear paths to advance to warehouse operator and supervisory roles in our modern distribution facilities.'
};

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<EnhancedJobListing[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (categorySlug) {
      const categoryJobs = getJobsByCategory(categorySlug);
      if (categoryJobs.length > 0) {
        setJobs(categoryJobs);
        setCategoryName(categoryJobs[0].category);
      } else {
        navigate('/');
      }
    }
  }, [categorySlug, navigate]);

  const handleApply = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setIsModalOpen(true);
  };

  if (jobs.length === 0) {
    return null;
  }

  const breadcrumbItems = [
    { name: 'Jobs', url: '/#jobs' },
    { name: categoryName, url: `/jobs/category/${categorySlug}` }
  ];

  const description = categorySlug ? categoryDescriptions[categorySlug] || '' : '';
  const allCategories = getAllCategories().filter(cat => cat.slug !== categorySlug);

  return (
    <div className="min-h-screen bg-background">
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

        {/* Category Header */}
        <div className="mt-8 mb-12 text-center">
          <Badge variant="secondary" className="mb-4 text-base px-6 py-2">
            <Briefcase className="w-4 h-4 mr-2" />
            {categoryName}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {categoryName} Jobs at Carrefour Kenya
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
            {description}
          </p>
          <p className="text-lg font-semibold text-secondary">
            {jobs.length} {jobs.length === 1 ? 'Position' : 'Positions'} Available
          </p>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {jobs.map((job) => (
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

        {/* Other Categories */}
        {allCategories.length > 0 && (
          <div className="py-12 bg-muted/30 rounded-lg">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Explore Other Departments
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                {allCategories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/jobs/category/${category.slug}`}
                    className="p-4 bg-card rounded-lg border border-border hover:border-secondary hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">{category.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {category.count} {category.count === 1 ? 'position' : 'positions'}
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

export default CategoryPage;
