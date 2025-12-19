const Service = require('../models/Service');
const User = require('../models/User');
const Provider = require('../models/Provider');

const services = [
  {
    name: 'Plumbing Services',
    category: 'plumbing',
    description: 'Professional plumbing services including pipe repairs, leak fixing, drain cleaning, and new installations.',
    basePrice: 500,
    pricePerHour: 300,
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Electrical Work',
    category: 'electrical',
    description: 'Licensed electricians for wiring, repairs, electrical installations, and safety inspections.',
    basePrice: 600,
    pricePerHour: 350,
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Home Cleaning',
    category: 'cleaning',
    description: 'Deep cleaning services for your entire home including kitchen, bathrooms, and all living areas.',
    basePrice: 800,
    pricePerHour: 200,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'House Painting',
    category: 'painting',
    description: 'Interior and exterior painting services with premium quality paints.',
    basePrice: 1500,
    pricePerHour: 400,
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Carpentry Services',
    category: 'carpentry',
    description: 'Custom furniture making, repairs, and woodwork installations.',
    basePrice: 700,
    pricePerHour: 350,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Appliance Repair',
    category: 'appliance-repair',
    description: 'Expert repair and maintenance of home appliances.',
    basePrice: 400,
    pricePerHour: 250,
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Pest Control',
    category: 'pest-control',
    description: 'Complete pest control solutions for all types of pests.',
    basePrice: 1000,
    pricePerHour: 0,
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'AC Service & Repair',
    category: 'appliance-repair',
    description: 'AC installation, servicing, gas refilling, and repair services.',
    basePrice: 500,
    pricePerHour: 300,
    image: 'https://images.unsplash.com/photo-1631545806609-c2f4e4e6e0e8?w=800&h=600&fit=crop&crop=center'
  }
];

const generateProviders = () => {
  const categories = ['plumbing', 'electrical', 'cleaning', 'painting', 'carpentry', 'appliance-repair', 'pest-control'];
  const names = [
    'Rajesh Kumar', 'Amit Sharma', 'Priya Singh', 'Vikram Patel', 'Suresh Gupta',
    'Anita Verma', 'Rohit Jain', 'Kavita Reddy', 'Manoj Yadav', 'Sunita Agarwal',
    'Deepak Singh', 'Meera Nair', 'Arun Mishra', 'Pooja Sharma', 'Ravi Kumar',
    'Neha Joshi', 'Sanjay Tiwari', 'Rekha Pandey', 'Ashok Mehta', 'Geeta Rao',
    'Vinod Sinha', 'Shanti Devi', 'Ramesh Chandra', 'Usha Kumari', 'Dinesh Prasad',
    'Lata Saxena', 'Mukesh Gupta', 'Radha Krishnan', 'Sunil Yadav', 'Kamala Devi',
    'Prakash Jha', 'Sushma Bansal', 'Naresh Kumar', 'Pushpa Agarwal', 'Mahesh Soni',
    'Savita Gupta', 'Yogesh Sharma', 'Manju Devi', 'Kishore Babu', 'Lalita Singh'
  ];
  
  const providers = [];
  let nameIndex = 0;
  
  categories.forEach(category => {
    for (let i = 0; i < 5; i++) {
      providers.push({
        name: names[nameIndex],
        email: `${names[nameIndex].toLowerCase().replace(' ', '.')}${i + 1}@provider.com`,
        password: 'password123',
        phone: `98765${String(nameIndex).padStart(5, '0')}`,
        role: 'provider',
        services: [category],
        experience: Math.floor(Math.random() * 15) + 2,
        bio: `Professional ${category} expert with years of experience`
      });
      nameIndex++;
    }
  });
  
  return providers;
};

const seedDatabase = async () => {
  try {
    await Service.deleteMany({});
    await Provider.deleteMany({});
    await User.deleteMany({ role: 'provider' });
    
    const createdServices = await Service.insertMany(services);
    console.log('✅ Services seeded successfully');

    const providers = generateProviders();
    
    for (const providerData of providers) {
      const user = new User({
        name: providerData.name,
        email: providerData.email,
        password: providerData.password,
        phone: providerData.phone,
        role: providerData.role
      });
      await user.save();

      const serviceIds = createdServices
        .filter(s => providerData.services.includes(s.category))
        .map(s => s._id);

      const provider = new Provider({
        userId: user._id,
        services: serviceIds,
        experience: providerData.experience,
        bio: providerData.bio,
        rating: 3.5 + Math.random() * 1.5,
        totalReviews: Math.floor(Math.random() * 50) + 5
      });
      await provider.save();
    }
    
    console.log('✅ 35 Providers seeded successfully (5 per service)');
    console.log('🎉 Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

module.exports = seedDatabase;