import mongoose from 'mongoose';

const furnitureSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // store URL or /images/... path
  description: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const FurnitureModel = mongoose.model('Furniture', furnitureSchema);
export default FurnitureModel;
