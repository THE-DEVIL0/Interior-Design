import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Furniture from './models/furniture.model.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedFurniture = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const items = [
      {
        name: 'Modern Sofa',
        image: '/images/sofa.jpg',
        description: 'A comfortable modern sofa for your living room.',
        price: 499
      },
      {
        name: 'Wooden Dining Table',
        image: '/images/dining-table.jpg',
        description: 'A solid wood dining table that seats six.',
        price: 699
      },
      {
        name: 'Queen Bed Frame',
        image: '/images/bed.jpg',
        description: 'Queen-size bed frame with headboard.',
        price: 399
      },
      {
        name: 'Office Chair',
        image: '/images/office-chair.jpg',
        description: 'Ergonomic office chair with lumbar support.',
        price: 149
      },
      {
        name: 'Bookshelf',
        image: '/images/bookshelf.jpg',
        description: '5-tier wooden bookshelf for your study or bedroom.',
        price: 129
      },
      {
        name: 'TV Stand',
        image: '/images/tv-stand.jpg',
        description: 'Stylish TV stand with storage compartments.',
        price: 179
      },
      {
        name: 'Coffee Table',
        image: '/images/coffee-table.jpg',
        description: 'Glass-top coffee table with a steel frame.',
        price: 109
      },
      {
        name: 'Wardrobe',
        image: '/images/wardrobe.jpg',
        description: 'Spacious wardrobe with mirrored doors.',
        price: 499
      },
      {
        name: 'Study Desk',
        image: '/images/study-desk.jpg',
        description: 'Compact desk suitable for study or work-from-home.',
        price: 189
      },
      {
        name: 'Recliner Chair',
        image: '/images/recliner.jpg',
        description: 'Soft recliner chair with adjustable backrest.',
        price: 349
      }
    ];

    await Furniture.insertMany(items);
    console.log('✅ Furniture items inserted successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding furniture items:', err);
    process.exit(1);
  }
};

seedFurniture();
