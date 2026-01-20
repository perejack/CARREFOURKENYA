export interface EnhancedJobListing {
  id: string;
  title: string;
  slug: string;
  salary: string;
  salaryAmount: number;
  medical: string;
  medicalAmount: number;
  category: string;
  categorySlug: string;
  employmentType: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  location: string;
  datePosted: string;
  validThrough: string;
  image?: string;
}

export const enhancedJobListings: EnhancedJobListing[] = [
  {
    id: "1",
    title: "Receptionist",
    slug: "receptionist",
    salary: "Ksh. 34,000",
    salaryAmount: 34000,
    medical: "Ksh. 3,000",
    medicalAmount: 3000,
    category: "Customer Service",
    categorySlug: "customer-service",
    employmentType: "FULL_TIME",
    description: "Join Carrefour Kenya as a Receptionist and be the first point of contact for our valued customers. This role offers an excellent opportunity to develop your customer service skills while working with Kenya's leading retailer. As a Receptionist at Carrefour Kenya, you'll be responsible for creating positive first impressions, managing front desk operations, and ensuring smooth communication between customers and various departments. We offer competitive compensation, medical benefits, and clear career progression opportunities in the retail sector.",
    responsibilities: [
      "Greet and welcome customers, visitors, and staff members with professionalism and courtesy",
      "Answer incoming phone calls, direct inquiries to appropriate departments, and take accurate messages",
      "Manage front desk operations including scheduling appointments and maintaining visitor logs",
      "Handle customer inquiries, complaints, and feedback with patience and efficiency",
      "Maintain reception area cleanliness and ensure professional presentation at all times",
      "Coordinate with various departments to ensure smooth communication and operations",
      "Process basic administrative tasks including data entry, filing, and document management",
      "Assist with customer service issues and escalate complex matters to supervisors when necessary"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above with valid national ID",
      "Diploma or certificate in Customer Service, Business Administration, or related field preferred",
      "Minimum 1 year experience in reception, customer service, or hospitality role",
      "Excellent verbal and written communication skills in English and Swahili",
      "Professional appearance and demeanor with strong interpersonal skills",
      "Proficiency in Microsoft Office Suite (Word, Excel, Outlook)",
      "Ability to multitask and handle high-pressure situations calmly",
      "Strong organizational skills with attention to detail and accuracy"
    ],
    benefits: [
      "Competitive monthly salary of Ksh. 34,000",
      "Medical allowance of Ksh. 3,000 per month",
      "Staff discounts on Carrefour products",
      "Career growth opportunities within Carrefour Kenya",
      "Professional training and development programs",
      "Supportive work environment with experienced team members"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "2",
    title: "Accountant & Cashier",
    slug: "accountant-cashier",
    salary: "Ksh. 32,000",
    salaryAmount: 32000,
    medical: "Ksh. 3,000",
    medicalAmount: 3000,
    category: "Finance",
    categorySlug: "finance",
    employmentType: "FULL_TIME",
    description: "Carrefour Kenya is seeking a detail-oriented Accountant & Cashier to join our finance team. This dual-role position combines accounting responsibilities with cashier duties, offering comprehensive exposure to retail financial operations. You'll handle cash transactions, maintain financial records, and ensure accuracy in all monetary dealings. This position is ideal for individuals looking to build a career in retail finance with opportunities for professional growth and development.",
    responsibilities: [
      "Process customer transactions accurately using point-of-sale (POS) systems",
      "Handle cash, credit card, and mobile money payments with precision",
      "Maintain accurate daily cash reports and reconcile cash drawers at end of shifts",
      "Record financial transactions and maintain accounting records in compliance with company policies",
      "Prepare daily sales reports and submit to finance department",
      "Assist with inventory reconciliation and stock valuation processes",
      "Process refunds, exchanges, and void transactions following proper procedures",
      "Provide excellent customer service while maintaining transaction accuracy"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Diploma in Accounting, Finance, Business Administration, or related field",
      "Minimum 1-2 years experience in cashier or accounting role, preferably in retail",
      "Strong numerical skills and attention to detail",
      "Proficiency in accounting software and MS Excel",
      "Understanding of basic accounting principles and cash handling procedures",
      "Excellent integrity and trustworthiness with financial matters",
      "Good communication skills and customer service orientation"
    ],
    benefits: [
      "Monthly salary of Ksh. 32,000",
      "Medical allowance of Ksh. 3,000",
      "Hands-on experience in retail finance operations",
      "Professional development in accounting and finance",
      "Employee discounts on store purchases",
      "Opportunity for career advancement within finance department"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "3",
    title: "Warehouse Supervisor",
    slug: "warehouse-supervisor",
    salary: "Ksh. 31,000",
    salaryAmount: 31000,
    medical: "Ksh. 2,000",
    medicalAmount: 2000,
    category: "Operations",
    categorySlug: "operations",
    employmentType: "FULL_TIME",
    description: "Take charge of warehouse operations at Carrefour Kenya as a Warehouse Supervisor. This leadership role involves overseeing daily warehouse activities, managing inventory, and leading a team of warehouse staff. You'll ensure efficient receiving, storage, and dispatch of goods while maintaining safety standards and operational excellence. This position offers excellent opportunities for operations management experience and career progression within one of Kenya's largest retail chains.",
    responsibilities: [
      "Supervise and coordinate daily warehouse operations including receiving, storage, and dispatch",
      "Lead and manage warehouse staff, including scheduling, training, and performance monitoring",
      "Ensure accurate inventory management through regular stock counts and reconciliation",
      "Implement and maintain warehouse safety standards and operating procedures",
      "Coordinate with procurement and sales teams to ensure timely product availability",
      "Monitor warehouse equipment maintenance and report any issues promptly",
      "Prepare daily, weekly, and monthly warehouse reports for management review",
      "Optimize warehouse space utilization and implement efficient storage systems"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Diploma in Supply Chain Management, Logistics, Business Management, or related field",
      "Minimum 2-3 years experience in warehouse operations, with at least 1 year in supervisory role",
      "Strong leadership and team management skills",
      "Knowledge of inventory management systems and warehouse management software",
      "Understanding of health and safety regulations in warehouse environments",
      "Excellent organizational and problem-solving abilities",
      "Physical fitness to handle warehouse environment demands"
    ],
    benefits: [
      "Competitive salary of Ksh. 31,000 per month",
      "Medical allowance of Ksh. 2,000",
      "Leadership development opportunities",
      "Career advancement path to warehouse management",
      "Staff discounts on Carrefour products",
      "Comprehensive training in warehouse operations"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "4",
    title: "Distributor and Marketer",
    slug: "distributor-marketer",
    salary: "Ksh. 29,000",
    salaryAmount: 29000,
    medical: "Ksh. 1,500",
    medicalAmount: 1500,
    category: "Sales & Marketing",
    categorySlug: "sales-marketing",
    employmentType: "FULL_TIME",
    description: "Join Carrefour Kenya's dynamic sales and marketing team as a Distributor and Marketer. This exciting role combines product distribution with marketing activities to drive sales and increase brand visibility. You'll be responsible for promoting Carrefour products, managing distribution channels, and building relationships with customers and partners. This position is perfect for individuals with strong communication skills who enjoy field work and customer interaction.",
    responsibilities: [
      "Distribute Carrefour promotional materials and products to designated areas",
      "Conduct market research to identify new sales opportunities and customer needs",
      "Promote Carrefour products and services through direct marketing activities",
      "Build and maintain relationships with customers, retailers, and distribution partners",
      "Collect customer feedback and market intelligence for management review",
      "Achieve monthly sales and distribution targets set by management",
      "Organize and participate in promotional events, product demonstrations, and marketing campaigns",
      "Prepare daily activity reports and sales performance updates"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Diploma in Marketing, Sales, Business Administration, or related field preferred",
      "Minimum 1 year experience in sales, marketing, or distribution role",
      "Excellent communication and interpersonal skills",
      "Self-motivated with ability to work independently in the field",
      "Knowledge of Nairobi and surrounding areas",
      "Ability to ride a motorcycle or bicycle for distribution activities (preferred)",
      "Strong negotiation and persuasion skills"
    ],
    benefits: [
      "Monthly salary of Ksh. 29,000",
      "Medical allowance of Ksh. 1,500",
      "Commission opportunities based on sales performance",
      "Field allowance for distribution activities",
      "Professional development in sales and marketing",
      "Career growth opportunities within Carrefour Kenya"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "5",
    title: "Driver",
    slug: "driver",
    salary: "Ksh. 27,400",
    salaryAmount: 27400,
    medical: "Ksh. 2,500",
    medicalAmount: 2500,
    category: "Logistics",
    categorySlug: "logistics",
    employmentType: "FULL_TIME",
    description: "Carrefour Kenya is looking for a professional and reliable Driver to join our logistics team. As a Driver, you'll be responsible for safe and timely transportation of goods, staff, and materials across various locations in Kenya. This role requires excellent driving skills, knowledge of Kenyan roads, and commitment to safety standards. We offer competitive compensation and the opportunity to work with one of Kenya's most respected retail brands.",
    responsibilities: [
      "Safely transport goods, products, and staff to designated locations across Kenya",
      "Conduct pre-trip and post-trip vehicle inspections to ensure roadworthiness",
      "Maintain accurate delivery logs, mileage records, and fuel consumption reports",
      "Load and unload goods carefully to prevent damage during transportation",
      "Plan efficient routes to ensure timely deliveries and minimize fuel consumption",
      "Adhere to all traffic regulations and company driving policies",
      "Maintain vehicle cleanliness and report any mechanical issues immediately",
      "Assist with warehouse operations during loading and offloading activities"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Valid Kenyan driving license (Class BCE or higher) with at least 2 years validity",
      "Minimum 3 years professional driving experience, preferably with commercial vehicles",
      "Clean driving record with no major traffic violations",
      "Excellent knowledge of Nairobi and major Kenyan highways",
      "Good understanding of vehicle maintenance and basic troubleshooting",
      "Physical fitness to handle loading and offloading activities",
      "Punctuality, reliability, and strong work ethic"
    ],
    benefits: [
      "Monthly salary of Ksh. 27,400",
      "Medical allowance of Ksh. 2,500",
      "Fuel and maintenance provided by company",
      "Overtime compensation for extended hours",
      "Professional driving training and safety programs",
      "Long-term employment with stable income"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "6",
    title: "Guard",
    slug: "guard",
    salary: "Ksh. 27,000",
    salaryAmount: 27000,
    medical: "Ksh. 700",
    medicalAmount: 700,
    category: "Security",
    categorySlug: "security",
    employmentType: "FULL_TIME",
    description: "Ensure the safety and security of Carrefour Kenya premises as a Security Guard. This critical role involves protecting company assets, monitoring premises, and ensuring the safety of staff and customers. You'll work as part of a professional security team, maintaining vigilance and responding to security incidents. We seek reliable individuals with strong integrity and commitment to maintaining a safe shopping environment.",
    responsibilities: [
      "Monitor and patrol Carrefour premises to prevent theft, vandalism, and unauthorized access",
      "Control access points by verifying identification and maintaining visitor logs",
      "Conduct security checks of bags, packages, and vehicles as per company policy",
      "Respond promptly to security incidents, alarms, and emergency situations",
      "Maintain surveillance through CCTV monitoring and physical patrols",
      "Report suspicious activities, safety hazards, and security breaches to supervisors",
      "Assist customers and staff with directions and general inquiries",
      "Complete incident reports and maintain accurate security logs"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Certificate in Security Management or related field preferred",
      "Minimum 1 year experience in security or related field",
      "Physical fitness and ability to stand for extended periods",
      "High level of integrity, honesty, and trustworthiness",
      "Good observation skills and attention to detail",
      "Ability to remain calm and professional under pressure",
      "Basic literacy and numeracy skills for report writing"
    ],
    benefits: [
      "Monthly salary of Ksh. 27,000",
      "Medical allowance of Ksh. 700",
      "Security training and professional development",
      "Uniform and equipment provided",
      "Shift allowances for night duty",
      "Stable employment with reputable company"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "7",
    title: "Sales Attendant",
    slug: "sales-attendant",
    salary: "Ksh. 25,000",
    salaryAmount: 25000,
    medical: "Ksh. 500",
    medicalAmount: 500,
    category: "Customer Service",
    categorySlug: "customer-service",
    employmentType: "FULL_TIME",
    description: "Start your retail career as a Sales Attendant at Carrefour Kenya. This entry-level position offers excellent opportunities to develop customer service skills while working in a fast-paced retail environment. As a Sales Attendant, you'll assist customers with their shopping needs, maintain product displays, and ensure a positive shopping experience. This role is perfect for individuals who enjoy working with people and want to grow in the retail industry.",
    responsibilities: [
      "Greet customers warmly and assist them in locating products throughout the store",
      "Provide product information, recommendations, and answer customer inquiries",
      "Maintain neat and organized product displays, ensuring proper stock rotation",
      "Process customer transactions accurately at checkout counters",
      "Handle customer complaints and concerns with professionalism and courtesy",
      "Monitor inventory levels and report stock shortages to supervisors",
      "Ensure cleanliness and orderliness of assigned sections",
      "Participate in promotional activities and product demonstrations"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "KCSE certificate or equivalent qualification",
      "Previous retail or customer service experience preferred but not required",
      "Excellent communication and interpersonal skills",
      "Friendly, approachable personality with customer-focused attitude",
      "Ability to work flexible hours including weekends and holidays",
      "Physical stamina to stand for extended periods and lift moderate weights",
      "Basic numeracy skills for handling transactions"
    ],
    benefits: [
      "Monthly salary of Ksh. 25,000",
      "Medical allowance of Ksh. 500",
      "On-the-job training in retail operations",
      "Career advancement opportunities to senior positions",
      "Employee discounts on Carrefour products",
      "Supportive team environment"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "8",
    title: "Chef",
    slug: "chef",
    salary: "Ksh. 23,750",
    salaryAmount: 23750,
    medical: "Ksh. 1,500",
    medicalAmount: 1500,
    category: "Food Service",
    categorySlug: "food-service",
    employmentType: "FULL_TIME",
    description: "Showcase your culinary skills as a Chef at Carrefour Kenya's food service department. This exciting role involves preparing fresh, high-quality meals for customers, maintaining food safety standards, and contributing to our reputation for excellence in food service. You'll work in a modern kitchen environment with opportunities to develop your culinary expertise and advance your career in the food service industry.",
    responsibilities: [
      "Prepare and cook a variety of dishes according to Carrefour's recipes and quality standards",
      "Ensure food safety and hygiene standards are maintained at all times",
      "Manage food inventory, monitor stock levels, and minimize waste",
      "Maintain cleanliness and organization of kitchen equipment and work areas",
      "Collaborate with team members to ensure efficient kitchen operations",
      "Create attractive food presentations that appeal to customers",
      "Follow portion control guidelines to maintain cost efficiency",
      "Assist in menu planning and suggest new dishes based on customer preferences"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Certificate or Diploma in Food Production, Culinary Arts, or related field",
      "Minimum 2 years experience as a chef or cook in restaurant, hotel, or retail setting",
      "Knowledge of food safety regulations and HACCP principles",
      "Ability to work efficiently under pressure during peak hours",
      "Creativity in food preparation and presentation",
      "Physical stamina to stand for long periods in hot kitchen environment",
      "Team player with good communication skills"
    ],
    benefits: [
      "Monthly salary of Ksh. 23,750",
      "Medical allowance of Ksh. 1,500",
      "Opportunity to develop culinary skills",
      "Staff meals provided during shifts",
      "Career growth in food service management",
      "Modern kitchen facilities and equipment"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "9",
    title: "Cleaner",
    slug: "cleaner",
    salary: "Ksh. 22,400",
    salaryAmount: 22400,
    medical: "Ksh. 500",
    medicalAmount: 500,
    category: "Facility Management",
    categorySlug: "facility-management",
    employmentType: "FULL_TIME",
    description: "Join Carrefour Kenya's facility management team as a Cleaner and play a vital role in maintaining a clean, safe, and welcoming shopping environment. This position involves ensuring all areas of the store are spotlessly clean and well-maintained. We value hardworking individuals who take pride in their work and understand the importance of cleanliness in creating positive customer experiences.",
    responsibilities: [
      "Clean and sanitize all areas of the store including sales floors, restrooms, and staff areas",
      "Sweep, mop, vacuum, and polish floors to maintain cleanliness standards",
      "Empty trash bins regularly and ensure proper waste disposal",
      "Clean windows, mirrors, and glass surfaces to maintain clear visibility",
      "Restock cleaning supplies and report shortages to supervisors",
      "Respond promptly to spills and cleaning emergencies",
      "Follow health and safety guidelines when handling cleaning chemicals",
      "Maintain cleaning equipment in good working condition"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Basic education with ability to read and follow instructions",
      "Previous cleaning experience preferred but not required",
      "Physical fitness and ability to perform manual labor",
      "Attention to detail and commitment to high cleanliness standards",
      "Reliability, punctuality, and strong work ethic",
      "Ability to work independently with minimal supervision",
      "Willingness to work flexible hours including early mornings or evenings"
    ],
    benefits: [
      "Monthly salary of Ksh. 22,400",
      "Medical allowance of Ksh. 500",
      "Cleaning supplies and protective equipment provided",
      "Stable employment with regular income",
      "Opportunity for advancement to supervisory roles",
      "Supportive work environment"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "10",
    title: "Store Keeper",
    slug: "store-keeper",
    salary: "Ksh. 22,000",
    salaryAmount: 22000,
    medical: "Ksh. 500",
    medicalAmount: 500,
    category: "Operations",
    categorySlug: "operations",
    employmentType: "FULL_TIME",
    description: "Manage inventory and stock control as a Store Keeper at Carrefour Kenya. This important role involves receiving, storing, and issuing goods while maintaining accurate inventory records. You'll ensure products are properly organized and readily available for sales operations. This position offers excellent exposure to retail operations and opportunities for career advancement in inventory management.",
    responsibilities: [
      "Receive incoming stock deliveries and verify quantities against delivery notes",
      "Organize and store products systematically to maximize space utilization",
      "Maintain accurate inventory records using manual and computerized systems",
      "Issue stock to sales floor and other departments based on requisitions",
      "Conduct regular stock counts and reconcile discrepancies",
      "Monitor stock levels and alert management when reordering is needed",
      "Ensure proper stock rotation to minimize expiry and obsolescence",
      "Maintain cleanliness and organization of storage areas"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "KCSE certificate or Diploma in Business, Supply Chain, or related field",
      "Minimum 1 year experience in store keeping or inventory management",
      "Good understanding of inventory management principles",
      "Basic computer skills and familiarity with inventory software",
      "Strong organizational skills and attention to detail",
      "Physical fitness to handle lifting and moving of stock",
      "Honesty and integrity in handling company inventory"
    ],
    benefits: [
      "Monthly salary of Ksh. 22,000",
      "Medical allowance of Ksh. 500",
      "Training in inventory management systems",
      "Career progression to senior store keeping roles",
      "Employee discounts on purchases",
      "Stable employment with growth opportunities"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  },
  {
    id: "11",
    title: "Loader and Off Loader",
    slug: "loader-offloader",
    salary: "Ksh. 17,000",
    salaryAmount: 17000,
    medical: "Ksh. 500",
    medicalAmount: 500,
    category: "Warehouse",
    categorySlug: "warehouse",
    employmentType: "FULL_TIME",
    description: "Join Carrefour Kenya's warehouse team as a Loader and Off Loader. This physically demanding role involves loading and unloading goods from delivery vehicles, ensuring products are handled safely and efficiently. You'll work as part of a team to support warehouse operations and maintain smooth flow of goods. This entry-level position offers stable employment and opportunities to develop skills in warehouse operations.",
    responsibilities: [
      "Load and unload goods from delivery trucks and containers safely and efficiently",
      "Move products within warehouse using manual handling techniques or equipment",
      "Stack and organize goods in designated storage areas",
      "Verify quantities and condition of goods during loading and offloading",
      "Assist with inventory counts and stock checks as required",
      "Maintain cleanliness and safety in loading and offloading areas",
      "Report damaged goods or discrepancies to supervisors immediately",
      "Follow safety procedures and wear appropriate protective equipment"
    ],
    requirements: [
      "Kenyan citizen aged 18 years and above",
      "Basic education with ability to read and follow instructions",
      "Physical fitness and ability to lift heavy loads (up to 25kg)",
      "Previous experience in warehouse or manual labor preferred",
      "Ability to work in a team environment",
      "Punctuality and reliability",
      "Understanding of basic safety procedures",
      "Willingness to work overtime when required"
    ],
    benefits: [
      "Monthly salary of Ksh. 17,000",
      "Medical allowance of Ksh. 500",
      "Overtime compensation for extra hours",
      "Protective equipment provided",
      "Opportunity to advance to warehouse operator roles",
      "Regular employment with stable income"
    ],
    location: "Nairobi, Kenya",
    datePosted: "2026-01-20",
    validThrough: "2026-03-20"
  }
];

// Helper function to get job by slug
export const getJobBySlug = (slug: string): EnhancedJobListing | undefined => {
  return enhancedJobListings.find(job => job.slug === slug);
};

// Helper function to get jobs by category
export const getJobsByCategory = (categorySlug: string): EnhancedJobListing[] => {
  return enhancedJobListings.filter(job => job.categorySlug === categorySlug);
};

// Helper function to get all unique categories
export const getAllCategories = (): { name: string; slug: string; count: number }[] => {
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
  
  enhancedJobListings.forEach(job => {
    const existing = categoryMap.get(job.categorySlug);
    if (existing) {
      existing.count++;
    } else {
      categoryMap.set(job.categorySlug, {
        name: job.category,
        slug: job.categorySlug,
        count: 1
      });
    }
  });
  
  return Array.from(categoryMap.values());
};
