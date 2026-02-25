import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllBlogPosts, BlogPost } from '@/data/blogPosts';
import { BookOpen, Calendar, User } from 'lucide-react';
import { Helmet } from 'react-helmet';

const BlogIndex = () => {
  const posts = getAllBlogPosts();

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
        <title>Carrefour Kenya Career Blog | Job Search Tips & Retail News</title>
        <meta name="description" content="The official Carrefour Kenya Career Blog. Get expert job search tips, interview preparation guides, retail industry news, and salary insights for the Kenyan job market." />
        <meta name="keywords" content="Carrefour Kenya blog, job search tips Kenya, retail news Kenya, career advice Kenya, interview guide" />
      </Helmet>

      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-2xl font-bold text-secondary">
            Carrefour Kenya Careers
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 text-base px-6 py-2">
            <BookOpen className="w-4 h-4 mr-2" />
            Carrefour Kenya Career Blog
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your Guide to a Successful Career in Kenyan Retail
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Expert advice, industry insights, and behind-the-scenes looks at what it's like to work at Kenya's leading retailer.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`}>
              <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardHeader className="flex-grow">
                  <Badge variant="outline" className="w-fit mb-2">{post.category}</Badge>
                  <CardTitle className="text-xl font-bold text-foreground line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                    {post.summary}
                  </p>
                </CardHeader>
                <CardFooter className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
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

export default BlogIndex;
