import mongoose from 'mongoose';

const furnitureOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  furniture: { type: mongoose.Schema.Types.ObjectId, ref: 'Furniture', required: true },
  quantity: { type: Number, default: 1 },
  orderedAt: { type: Date, default: Date.now }
});

const FurnitureOrder = mongoose.model('FurnitureOrder', furnitureOrderSchema);
export default FurnitureOrder;
