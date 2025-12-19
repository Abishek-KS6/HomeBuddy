require('dotenv').config();
const mongoose = require('mongoose');
const Provider = require('./models/Provider');
const Service = require('./models/Service');

const testProviders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Testing provider-service filtering...\n');

    const services = await Service.find();
    console.log('Available services:');
    services.forEach(s => console.log(`- ${s.name} (${s._id})`));

    console.log('\nProviders and their services:');
    const providers = await Provider.find().populate(['userId', 'services']);
    providers.forEach(p => {
      console.log(`\n${p.userId.name}:`);
      p.services.forEach(s => console.log(`  - ${s.name} (${s._id})`));
    });

    console.log('\nTesting filtering for each service:');
    for (const service of services) {
      const filteredProviders = await Provider.find({ 
        services: { $in: [service._id] }, 
        availability: true 
      }).populate('userId', 'name');
      
      console.log(`\n${service.name}:`);
      if (filteredProviders.length === 0) {
        console.log('  No providers found');
      } else {
        filteredProviders.forEach(p => console.log(`  - ${p.userId.name}`));
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

testProviders();