import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FAQ = () => {
  const faqs = [
    {
      question: "How do I apply for a job at Carrefour Kenya?",
      answer: "To apply for a position at Carrefour Kenya, browse our available job listings on this website, select the position that matches your skills and interests, and click the 'Apply Now' button. You'll need to fill out an online application form and upload your CV. Make sure your CV is updated and tailored to the position you're applying for. Our HR team will review your application and contact you if you're shortlisted for an interview."
    },
    {
      question: "What are the salary ranges for different positions at Carrefour Kenya?",
      answer: "Carrefour Kenya offers competitive salaries based on position and experience level. Our salaries range from Ksh 17,000 to Ksh 34,000 per month for entry to mid-level positions. Receptionist positions start at Ksh 34,000, Accountant & Cashier at Ksh 32,000, Warehouse Supervisor at Ksh 31,000, Driver at Ksh 27,400, and entry-level positions like Loader start at Ksh 17,000. All positions include medical allowances ranging from Ksh 500 to Ksh 3,000 per month."
    },
    {
      question: "What benefits do Carrefour Kenya employees receive?",
      answer: "Carrefour Kenya employees enjoy a comprehensive benefits package including competitive monthly salaries, medical allowances (ranging from Ksh 500 to Ksh 3,000 depending on position), staff discounts on Carrefour products, professional training and development programs, career advancement opportunities, and a supportive work environment. We also provide necessary work equipment, uniforms where applicable, and opportunities for overtime compensation in certain roles."
    },
    {
      question: "What are the basic requirements to work at Carrefour Kenya?",
      answer: "All applicants must be Kenyan citizens aged 18 years and above with a valid national ID. General requirements include reliability, trustworthiness, punctuality, strong communication skills, and good customer service orientation. Specific positions have additional requirements such as relevant diplomas or certificates, previous experience in similar roles, and specialized skills. For driving positions, a valid Kenyan driving license with a clean record is required. Physical fitness is important for warehouse and manual labor positions."
    },
    {
      question: "How long does the recruitment process take?",
      answer: "The recruitment process at Carrefour Kenya typically takes 2-4 weeks from application submission to final decision. After you submit your application, our HR team reviews all applications within 5-7 business days. Shortlisted candidates are contacted for interviews, which may include multiple rounds depending on the position. The interview process usually takes 1-2 weeks. Successful candidates receive job offers and are guided through the onboarding process. We strive to keep all applicants informed throughout the process."
    },
    {
      question: "Do I need previous experience to apply for entry-level positions?",
      answer: "While previous experience is preferred for most positions, we do consider fresh graduates and candidates without prior experience for certain entry-level roles such as Sales Attendant, Cleaner, and Loader positions. For these roles, we focus on your attitude, willingness to learn, reliability, and alignment with our company values. We provide comprehensive on-the-job training to help you develop the necessary skills. However, supervisory and specialized positions like Warehouse Supervisor, Chef, and Accountant require relevant experience and qualifications."
    },
    {
      question: "What is the work schedule like at Carrefour Kenya?",
      answer: "Work schedules at Carrefour Kenya vary by position and department. Most retail positions operate on shift systems to cover store operating hours, which may include weekends and public holidays. Typical shifts are 8-9 hours with designated break times. Some positions like Security Guards work on rotating shifts including night shifts. Office and administrative roles generally follow standard business hours Monday to Friday. We strive to provide fair and balanced schedules while meeting business needs. Specific schedule details are discussed during the interview process."
    },
    {
      question: "Are there opportunities for career growth at Carrefour Kenya?",
      answer: "Yes, Carrefour Kenya is committed to employee development and career advancement. We have clear career progression paths across all departments. Entry-level employees can advance to senior positions through demonstrated performance, skill development, and training. We offer internal promotion opportunities, professional development programs, leadership training, and mentorship. Many of our current supervisors and managers started in entry-level positions. We believe in growing talent from within and provide the support and resources needed for your career advancement."
    },
    {
      question: "What locations does Carrefour Kenya operate in?",
      answer: "Carrefour Kenya operates multiple stores across Kenya, with major locations in Nairobi including branches in Westlands, CBD, Karen, Thika Road, and other strategic areas. We also have stores in other major cities including Mombasa, Kisumu, Nakuru, and Eldoret. Job opportunities are available across all our locations, and the specific location for each position is indicated in the job listing. During the application process, you can indicate your preferred work location, and we try to match candidates with positions closest to their residence when possible."
    },
    {
      question: "How should I prepare for an interview at Carrefour Kenya?",
      answer: "To prepare for a Carrefour Kenya interview, research our company values and retail operations. Review the job description thoroughly and prepare examples of how your skills and experience match the requirements. Dress professionally and arrive 15 minutes early. Bring multiple copies of your CV, original certificates, and national ID. Be ready to discuss your previous work experience, customer service skills, and why you want to work at Carrefour. Prepare questions to ask the interviewer about the role and company. Demonstrate enthusiasm, honesty, and professionalism throughout the interview."
    },
    {
      question: "Can I apply for multiple positions at once?",
      answer: "Yes, you can apply for multiple positions at Carrefour Kenya if you meet the qualifications for each role. However, we recommend focusing on positions that best match your skills, experience, and career goals. When applying for multiple positions, tailor your CV and application to highlight relevant experience for each specific role. Our HR team reviews all applications and may consider you for alternative positions if you're not selected for your first choice but are qualified for other openings."
    },
    {
      question: "What training is provided to new employees?",
      answer: "Carrefour Kenya provides comprehensive training to all new employees through our structured onboarding program. New hires receive orientation covering company policies, safety procedures, and workplace culture. Position-specific training includes hands-on instruction in job duties, equipment operation, customer service standards, and quality procedures. We also offer ongoing training programs for skill development, product knowledge, and career advancement. Training is conducted by experienced supervisors and includes both classroom sessions and practical on-the-job training."
    },
    {
      question: "Is accommodation provided for employees?",
      answer: "Carrefour Kenya does not typically provide accommodation for employees. However, our competitive salary packages are designed to enable employees to secure their own housing. For positions requiring relocation to different cities, we may offer relocation assistance on a case-by-case basis. We recommend considering the commute time and transportation costs when applying for positions at different locations. Many of our employees live in nearby residential areas with good public transportation access to our stores."
    },
    {
      question: "What is the dress code at Carrefour Kenya?",
      answer: "Carrefour Kenya maintains professional dress code standards across all positions. Customer-facing roles such as Sales Attendants, Cashiers, and Receptionists are provided with company uniforms which must be worn during working hours and kept clean and presentable. Warehouse and logistics staff receive appropriate work wear and safety equipment. Office and administrative staff are expected to dress in business casual or business professional attire. Specific dress code requirements are provided during the onboarding process. All employees are expected to maintain neat, professional appearance at all times."
    },
    {
      question: "How does Carrefour Kenya support employee wellbeing?",
      answer: "Employee wellbeing is a priority at Carrefour Kenya. We provide medical allowances to support healthcare needs, maintain safe working environments with proper safety equipment and procedures, and offer reasonable work schedules with designated break times. We promote work-life balance and have policies against workplace harassment and discrimination. Our supportive management team is accessible for addressing employee concerns. We also organize team-building activities and recognize outstanding employee performance through various recognition programs."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
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
            <HelpCircle className="w-4 h-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Got Questions About Working at Carrefour Kenya?
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about job applications, requirements, benefits, and career opportunities at Carrefour Kenya.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-secondary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* CTA Section */}
        <div className="bg-secondary text-white rounded-lg p-8 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl mb-6 text-white/90">
            Can't find the answer you're looking for? Contact our HR team or browse our available job positions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-white text-secondary hover:bg-white/90">
                Contact Us
              </Button>
            </Link>
            <Link to="/#jobs">
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                View Open Positions
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
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
    </div>
  );
};

export default FAQ;
