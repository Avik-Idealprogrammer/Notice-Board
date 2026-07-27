const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['ad', 'notice'], required: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', default: null },

    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    images: [{ type: String }],

    category: {
      type: String,
      required: true,
      enum: ['event', 'job', 'alert', 'sale', 'service', 'announcement', 'other'],
    },

    location: {
      city: { type: String, required: true },
      area: { type: String, required: true },
      lat: Number,
      lng: Number,
    },

    // only relevant for notices, optional otherwise
    eventDate: { type: Date, default: null },

    status: { type: String, enum: ['active', 'reported', 'removed'], default: 'active' },

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
    shareCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Discovery/search indexes - the feed is the module that gets hit hardest
postSchema.index({ 'location.city': 1, 'location.area': 1, category: 1, status: 1 });
postSchema.index({ title: 'text', description: 'text' });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Post', postSchema);
