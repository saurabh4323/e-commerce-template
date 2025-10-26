// app/models/Product.js
import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Variant name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Variant price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    required: [true, 'Variant stock is required'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  }
}, { _id: false });

const ReviewSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  images: {
    type: [{
      type: String,
      required: true
    }],
    validate: {
      validator: function(array) {
        return array.length > 0;
      },
      message: 'At least one image is required'
    }
  },
  additionalImages: {
    type: [{
      type: String
    }],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: {
      values: ['love', 'best-sellers', 'sisters', 'self-love', 'mom', 'rings'],
      message: '{VALUE} is not a valid category'
    }
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  variants: {
    type: [VariantSchema],
    default: []
  },
  reviews: {
    type: [ReviewSchema],
    default: []
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalReviews: {
    type: Number,
    default: 0,
    min: [0, 'Total reviews cannot be negative']
  },
  featured: {
    type: Boolean,
    default: false
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from product name before saving
ProductSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Calculate average rating and total reviews before saving
ProductSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = Math.round((totalRating / this.reviews.length) * 10) / 10;
    this.totalReviews = this.reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  next();
});

// Update the updatedAt timestamp before updating
ProductSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual for checking if product is in stock
ProductSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for checking if product has variants in stock
ProductSchema.virtual('hasVariantsInStock').get(function() {
  if (this.variants && this.variants.length > 0) {
    return this.variants.some(variant => variant.stock > 0);
  }
  return false;
});

// Index for faster queries
ProductSchema.index({ category: 1, featured: 1 });
ProductSchema.index({ slug: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ averageRating: -1 });

// Static method to get featured products
ProductSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({ featured: true })
    .sort({ averageRating: -1, createdAt: -1 })
    .limit(limit);
};

// Static method to get products by category
ProductSchema.statics.getByCategory = function(category, limit = 20) {
  return this.find({ category: category })
    .sort({ averageRating: -1, createdAt: -1 })
    .limit(limit);
};

// Instance method to add a review
ProductSchema.methods.addReview = function(user, rating, comment) {
  this.reviews.push({
    user,
    rating,
    comment,
    date: new Date()
  });
  return this.save();
};

// Instance method to update stock
ProductSchema.methods.updateStock = function(quantity) {
  this.stock = Math.max(0, this.stock + quantity);
  return this.save();
};

// Instance method to update variant stock
ProductSchema.methods.updateVariantStock = function(variantName, quantity) {
  const variant = this.variants.find(v => v.name === variantName);
  if (variant) {
    variant.stock = Math.max(0, variant.stock + quantity);
    return this.save();
  }
  throw new Error('Variant not found');
};

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);