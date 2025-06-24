import mongoose from 'mongoose';

const renovationBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceType: { type: String, required: true }, // NOT serviceTitle
    preferredDate: { type: Date, required: true },
    scheduledDate: { type: Date, required: true },
    address: { type: String, required: true },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  });
  
const RenovationBooking = mongoose.model('RenovationBooking', renovationBookingSchema);
export default RenovationBooking;
