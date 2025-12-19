require('dotenv').config();
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seedData');
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
  process.exit(0);
};
runSeed();
