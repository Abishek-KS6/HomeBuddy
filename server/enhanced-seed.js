const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Service = require('./models/Service');
const User = require('./models/User');
const Provider = require('./models/Provider');

const services = [
  {
    name: 'Plumbing Services',
    category: 'plumbing',
    description: 'Professional plumbing services including pipe repairs, leak fixing, drain cleaning, and new installations. Available 24/7 for emergency repairs.',
    basePrice: 500,
    pricePerHour: 300,
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Electrical Work',
    category: 'electrical',
    description: 'Licensed electricians for wiring, repairs, electrical installations, and safety inspections. All work guaranteed and code compliant.',
    basePrice: 600,
    pricePerHour: 350,
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Home Cleaning',
    category: 'cleaning',
    description: 'Deep cleaning services for your entire home including kitchen, bathrooms, and all living areas. Eco-friendly products available.',
    basePrice: 800,
    pricePerHour: 200,
    icon: '🧹',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'House Painting',
    category: 'painting',
    description: 'Interior and exterior painting services with premium quality paints. Color consultation and surface preparation included.',
    basePrice: 1500,
    pricePerHour: 400,
    icon: '🎨',
    image: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Carpentry Services',
    category: 'carpentry',
    description: 'Custom furniture making, repairs, and woodwork installations. From shelves to complete kitchen cabinets.',
    basePrice: 700,
    pricePerHour: 350,
    icon: '🪚',
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Appliance Repair',
    category: 'appliance-repair',
    description: 'Expert repair and maintenance of home appliances including refrigerators, washing machines, dishwashers, and more.',
    basePrice: 400,
    pricePerHour: 250,
    icon: '🔨',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'Pest Control',
    category: 'pest-control',
    description: 'Complete pest control solutions for cockroaches, termites, rodents, and other pests. Safe and effective treatments.',
    basePrice: 1000,
    pricePerHour: 0,
    icon: '🐛',
    image: 'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&h=600&fit=crop&crop=center'
  },
  {
    name: 'AC Service & Repair',
    category: 'other',
    description: 'AC installation, servicing, gas refilling, and repair services. Regular maintenance plans available.',
    basePrice: 500,
    pricePerHour: 300,
    icon: '❄️',
    image: 'https://images.unsplash.com/photo-1631545806609-c2f4e4e6e0e8?w=800&h=600&fit=crop&crop=center'
  }
];

const providersByService = {
  plumbing: [
    { name: 'Rajesh Kumar', email: 'rajesh@provider.com', phone: '9876543210', experience: 8, bio: 'Expert plumber with 8 years experience in residential and commercial plumbing' },
    { name: 'Suresh Patel', email: 'suresh@provider.com', phone: '9876543220', experience: 12, bio: 'Senior plumber specializing in emergency repairs and installations' },
    { name: 'Ramesh Singh', email: 'ramesh@provider.com', phone: '9876543230', experience: 6, bio: 'Skilled plumber with expertise in modern plumbing systems' },
    { name: 'Mahesh Gupta', email: 'mahesh@provider.com', phone: '9876543240', experience: 10, bio: 'Professional plumber with focus on eco-friendly solutions' },
    { name: 'Dinesh Sharma', email: 'dinesh@provider.com', phone: '9876543250', experience: 7, bio: 'Reliable plumber known for quality work and timely service' }
  ],
  electrical: [
    { name: 'Amit Sharma', email: 'amit@provider.com', phone: '9876543211', experience: 10, bio: 'Licensed electrician with expertise in residential wiring' },
    { name: 'Rohit Verma', email: 'rohit@provider.com', phone: '9876543221', experience: 9, bio: 'Certified electrician specializing in smart home installations' },
    { name: 'Anil Kumar', email: 'anil@provider.com', phone: '9876543231', experience: 11, bio: 'Expert electrician with industrial and residential experience' },
    { name: 'Vijay Joshi', email: 'vijay@provider.com', phone: '9876543241', experience: 8, bio: 'Professional electrician focused on safety and code compliance' },
    { name: 'Sanjay Yadav', email: 'sanjay@provider.com', phone: '9876543251', experience: 13, bio: 'Senior electrician with expertise in electrical troubleshooting' }
  ],
  cleaning: [
    { name: 'Priya Singh', email: 'priya@provider.com', phone: '9876543212', experience: 5, bio: 'Professional cleaning expert with eco-friendly approach' },
    { name: 'Sunita Devi', email: 'sunita@provider.com', phone: '9876543222', experience: 7, bio: 'Experienced cleaner specializing in deep cleaning services' },
    { name: 'Kavita Sharma', email: 'kavita@provider.com', phone: '9876543232', experience: 4, bio: 'Detail-oriented cleaner with focus on hygiene and sanitization' },
    { name: 'Meera Patel', email: 'meera@provider.com', phone: '9876543242', experience: 6, bio: 'Professional cleaner with expertise in residential cleaning' },
    { name: 'Rekha Gupta', email: 'rekha@provider.com', phone: '9876543252', experience: 8, bio: 'Reliable cleaning professional with excellent customer reviews' }
  ],
  painting: [
    { name: 'Vikram Patel', email: 'vikram@provider.com', phone: '9876543213', experience: 12, bio: 'Skilled painter with expertise in interior and exterior painting' },
    { name: 'Ravi Kumar', email: 'ravi@provider.com', phone: '9876543223', experience: 9, bio: 'Professional painter specializing in decorative finishes' },
    { name: 'Mohan Singh', email: 'mohan@provider.com', phone: '9876543233', experience: 11, bio: 'Expert painter with focus on quality and durability' },
    { name: 'Ashok Sharma', email: 'ashok@provider.com', phone: '9876543243', experience: 8, bio: 'Experienced painter known for neat and clean work' },
    { name: 'Deepak Yadav', email: 'deepak@provider.com', phone: '9876543253', experience: 10, bio: 'Creative painter with expertise in color consultation' }
  ],
  carpentry: [
    { name: 'Kiran Joshi', email: 'kiran@provider.com', phone: '9876543214', experience: 15, bio: 'Master carpenter with expertise in custom furniture making' },
    { name: 'Prakash Verma', email: 'prakash@provider.com', phone: '9876543224', experience: 10, bio: 'Skilled carpenter specializing in kitchen and wardrobe installations' },
    { name: 'Naresh Kumar', email: 'naresh@provider.com', phone: '9876543234', experience: 12, bio: 'Professional carpenter with focus on precision and quality' },
    { name: 'Harish Patel', email: 'harish@provider.com', phone: '9876543244', experience: 8, bio: 'Creative carpenter known for innovative woodwork solutions' },
    { name: 'Mukesh Singh', email: 'mukesh@provider.com', phone: '9876543254', experience: 11, bio: 'Experienced carpenter with expertise in repair and restoration' }
  ],
  'appliance-repair': [
    { name: 'Sachin Gupta', email: 'sachin@provider.com', phone: '9876543215', experience: 9, bio: 'Expert technician for all home appliance repairs' },
    { name: 'Rakesh Sharma', email: 'rakesh@provider.com', phone: '9876543225', experience: 11, bio: 'Certified technician specializing in refrigeration and AC' },
    { name: 'Manoj Kumar', email: 'manoj@provider.com', phone: '9876543235', experience: 7, bio: 'Skilled technician with expertise in washing machine repairs' },
    { name: 'Ajay Patel', email: 'ajay@provider.com', phone: '9876543245', experience: 10, bio: 'Professional technician for electronic appliance servicing' },
    { name: 'Vinod Singh', email: 'vinod@provider.com', phone: '9876543255', experience: 8, bio: 'Reliable technician with quick diagnostic and repair skills' }
  ],
  'pest-control': [
    { name: 'Arjun Yadav', email: 'arjun@provider.com', phone: '9876543216', experience: 6, bio: 'Certified pest control specialist with eco-friendly methods' },
    { name: 'Bharat Kumar', email: 'bharat@provider.com', phone: '9876543226', experience: 8, bio: 'Expert in termite control and prevention treatments' },
    { name: 'Chandan Singh', email: 'chandan@provider.com', phone: '9876543236', experience: 7, bio: 'Professional pest controller with safe and effective solutions' },
    { name: 'Devendra Sharma', email: 'devendra@provider.com', phone: '9876543246', experience: 9, bio: 'Experienced in residential and commercial pest management' },
    { name: 'Ganesh Patel', email: 'ganesh@provider.com', phone: '9876543256', experience: 5, bio: 'Specialist in rodent control and cockroach elimination' }
  ],
  other: [
    { name: 'Hitesh Verma', email: 'hitesh@provider.com', phone: '9876543217', experience: 10, bio: 'AC technician with expertise in installation and maintenance' },
    { name: 'Jitendra Kumar', email: 'jitendra@provider.com', phone: '9876543227', experience: 12, bio: 'Senior AC technician specializing in commercial systems' },
    { name: 'Lokesh Singh', email: 'lokesh@provider.com', phone: '9876543237', experience: 8, bio: 'Professional AC service expert with quick repair solutions' },
    { name: 'Nitesh Sharma', email: 'nitesh@provider.com', phone: '9876543247', experience: 9, bio: 'Certified AC technician with focus on energy efficiency' },
    { name: 'Pankaj Gupta', email: 'pankaj@provider.com', phone: '9876543257', experience: 7, bio: 'Reliable AC service provider with excellent customer satisfaction' }
  ]
};

const enhancedSeedDatabase = async () => {
  try {
    console.log('🚀 Starting enhanced database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/homebuddy');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Service.deleteMany({});
    await Provider.deleteMany({});
    await User.deleteMany({ role: 'provider' });
    console.log('🧹 Cleared existing data');

    // Seed services
    const createdServices = await Service.insertMany(services);
    console.log('✅ Services seeded successfully');

    let totalProviders = 0;

    // Seed providers for each service
    for (const service of createdServices) {
      const serviceProviders = providersByService[service.category] || [];
      console.log(`\n📋 Creating providers for ${service.name} (${service.category}):`);

      for (const providerData of serviceProviders) {
        try {
          // Hash password
          const hashedPassword = await bcrypt.hash('password123', 10);

          // Create user
          const user = new User({
            name: providerData.name,
            email: providerData.email,
            password: hashedPassword,
            phone: providerData.phone,
            role: 'provider'
          });
          await user.save();

          // Create provider
          const provider = new Provider({
            userId: user._id,
            services: [service._id],
            experience: providerData.experience,
            bio: providerData.bio,
            rating: (4.2 + Math.random() * 0.7).toFixed(1), // Rating between 4.2-4.9
            totalReviews: Math.floor(Math.random() * 80) + 20, // 20-100 reviews
            availability: true
          });
          await provider.save();

          console.log(`   ✓ ${providerData.name} - ${providerData.experience} years exp`);
          totalProviders++;
        } catch (error) {
          console.log(`   ✗ Failed to create ${providerData.name}: ${error.message}`);
        }
      }
    }

    console.log(`\n🎉 Enhanced seeding completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   • Services: ${createdServices.length}`);
    console.log(`   • Providers: ${totalProviders}`);
    console.log(`   • Average providers per service: ${(totalProviders / createdServices.length).toFixed(1)}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during enhanced seeding:', error);
    process.exit(1);
  }
};

// Run the seeding
enhancedSeedDatabase();