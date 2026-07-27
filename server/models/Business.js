const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['retail', 'food', 'services', 'health', 'education', 'other'],
    },
    description: { type: String, default: '' },
    location: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      lat: Number,
      lng: Number,
    },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      whatsapp: { type: String, default: '' },
    },
    logo: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Business', businessSchema);
