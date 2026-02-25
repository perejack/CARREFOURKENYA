import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import { getBlogPostBySlug, getAllBlogPosts, BlogPost as BlogPostType } from '@/data/blogPosts';
import { Calendar, User, BookOpen, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPostType[]>([]);

  useEffect(() => {
    if (slug) {
      const foundPost = getBlogPostBySlug(slug);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts (simple: all others for now)
        const related = getAllBlogPosts()
          .filter(p => p.id !== foundPost.id)
          .slice(0, 3);
        setRelatedPosts(related);
      } else {
        navigate('/blog');
      }
    }
  }, [slug, navigate]);

  if (!post) {
    return null;
  }

  const breadcrumbItems = [
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.title} | Carrefour Kenya Career Blog</title>
        <meta name="description" content={post.summary} />
        <meta name="keywords" content={post.keywords} />
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <article>
              <header className="mb-6">
                <Badge variant="secondary" className="mb-3 text-sm">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {post.category}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  {post.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(post.date)}
                  </div>
                </div>
              </header>

              <figure className="mb-6">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </figure>

              <div 
                className="prose prose-lg max-w-none text-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* CTA Section */}
            <Card className="bg-secondary text-white">
              <CardContent className="p-6 text-center">
                <h3 className="text-2xl font-bold mb-3">Ready to Apply?</h3>
                <p className="mb-4 text-white/90">
                  Put your new knowledge to work and find your next career opportunity at Carrefour Kenya.
                </p>
                <Link to="/#jobs">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="bg-white text-secondary hover:bg-white/90"
                  >
                    View Open Positions
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">More from the Blog</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="block p-3 rounded-lg border border-border hover:border-secondary hover:shadow-md transition-all"
                    >
                      <p className="font-semibold text-foreground mb-1">
                        {relatedPost.title}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {relatedPost.category}
                      </p>
                      <p className="text-sm font-semibold text-secondary">
                        {formatDate(relatedPost.date)}
                      </p>
                    </Link>
                  ))}
                  <Link to="/blog">
                    <Button variant="outline" className="w-full">
                      View All Articles
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Quick Job Search */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Quick Job Search</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Find jobs by location or category.
                </p>
                <Link to="/jobs/location/nairobi">
                  <Button variant="secondary" className="w-full">
                    Jobs in Nairobi
                  </Button>
                </Link>
                <Link to="/jobs/category/finance">
                  <Button variant="secondary" className="w-full">
                    Finance Jobs
                  </Button>
                </Link>
                <Link to="/#jobs">
                  <Button variant="outline" className="w-full">
                    View All Jobs
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <Link className="hover:text-foreground" to="/jobs/location/nairobi">
                Jobs in Nairobi
              </Link>
              <Link className="hover:text-foreground" to="/jobs/location/mombasa">
                Jobs in Mombasa
              </Link>
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
    </div>
  );
};

export default BlogPost;
