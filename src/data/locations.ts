import { EnhancedJobListing, enhancedJobListings } from './enhancedJobListings';

export interface LocationData {
  slug: string;
  name: string;
  description: string;
  jobs: EnhancedJobListing[];
  keywords: string;
}

// The enhancedJobListings array contains all job data
const allJobs = enhancedJobListings;

// Function to filter jobs by location (simplified for this example)
const getJobsByLocation = (locationName: string): EnhancedJobListing[] => {
  return allJobs.filter(job => job.location.includes(locationName));
};

export const allLocations: LocationData[] = [
  {
    slug: 'nairobi',
    name: 'Nairobi',
    description: 'Nairobi, the capital city, is the central hub for Carrefour Kenya\'s operations, offering the highest volume of job opportunities across all departments including management, finance, logistics, and retail operations. Join our largest teams and grow your career in the heart of Kenya\'s economy. We are actively hiring for all positions in our Nairobi branches.',
    jobs: getJobsByLocation('Nairobi'),
    keywords: 'Carrefour jobs Nairobi, retail jobs Nairobi, jobs in Nairobi, Nairobi vacancies, cashier jobs Nairobi, driver jobs Nairobi',
  },
  {
    slug: 'mombasa',
    name: 'Mombasa',
    description: 'Mombasa is a key location for Carrefour Kenya, especially for logistics and warehouse roles due to its port access. We offer exciting opportunities in retail, customer service, and supply chain management. Explore our vacancies in Mombasa and contribute to our coastal operations.',
    jobs: getJobsByLocation('Mombasa'),
    keywords: 'Carrefour jobs Mombasa, retail jobs Mombasa, jobs in Mombasa, Mombasa vacancies, logistics jobs Mombasa, warehouse jobs Mombasa',
  },
  {
    slug: 'kisumu',
    name: 'Kisumu',
    description: 'Carrefour Kenya is expanding its presence in Kisumu, offering a growing number of jobs in sales, customer service, and store operations. This is a fantastic opportunity to join a growing team in the Western region of Kenya and make a significant impact.',
    jobs: getJobsByLocation('Kisumu'),
    keywords: 'Carrefour jobs Kisumu, retail jobs Kisumu, jobs in Kisumu, Kisumu vacancies, sales jobs Kisumu, customer service jobs Kisumu',
  },
  {
    slug: 'nakuru',
    name: 'Nakuru',
    description: 'Nakuru is a vital regional center for Carrefour Kenya. We are looking for dedicated professionals for positions in store management, finance, and operations. Start your career in Nakuru with a leading global retailer.',
    jobs: getJobsByLocation('Nakuru'),
    keywords: 'Carrefour jobs Nakuru, retail jobs Nakuru, jobs in Nakuru, Nakuru vacancies, store manager jobs Nakuru, finance jobs Nakuru',
  },
  {
    slug: 'eldoret',
    name: 'Eldoret',
    description: 'Eldoret offers unique opportunities in our growing network. We are recruiting for roles in warehouse, logistics, and retail operations. Join the Carrefour Kenya team in Eldoret and benefit from competitive pay and excellent career growth.',
    jobs: getJobsByLocation('Eldoret'),
    keywords: 'Carrefour jobs Eldoret, retail jobs Eldoret, jobs in Eldoret, Eldoret vacancies, warehouse jobs Eldoret, logistics jobs Eldoret',
  },
];

export const getLocationBySlug = (slug: string): LocationData | undefined => {
  return allLocations.find(location => location.slug === slug);
};

export const getAllLocations = (): LocationData[] => {
  return allLocations;
};
