// Backend schemas for Woila Silver e-commerce site

// Product Schema
export const ProductSchema = {
  id: String,
  name: String,
  price: Number,
  description: String,
  images: [String],
  category: [String],
  reviews: Number,
  rating: Number,
  inStock: Boolean,
  variants: [{
    name: String,
    price: Number
  }],
  isBestSeller: Boolean,
  createdAt: Date,
  updatedAt: Date
};

// User Schema
export const UserSchema = {
  id: String,
  name: String,
  email: String,
  password: String, // Hashed
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  orders: [String], // Order IDs
  wishlist: [String], // Product IDs
  createdAt: Date,
  updatedAt: Date
};

// Order Schema
export const OrderSchema = {
  id: String,
  userId: String,
  products: [{
    productId: String,
    variantName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String
  },
  paymentMethod: String,
  paymentStatus: String, // pending, completed, failed
  orderStatus: String, // processing, shipped, delivered, cancelled
  createdAt: Date,
  updatedAt: Date
};

// Review Schema
export const ReviewSchema = {
  id: String,
  productId: String,
  userId: String,
  userName: String,
  rating: Number,
  comment: String,
  images: [String],
  createdAt: Date,
  updatedAt: Date
};

// Category Schema
export const CategorySchema = {
  id: String,
  name: String,
  path: String,
  image: String,
  description: String,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
};

// Testimonial Schema
export const TestimonialSchema = {
  id: String,
  userName: String,
  userImage: String,
  rating: Number,
  comment: String,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
};

// Cart Schema
export const CartSchema = {
  id: String,
  userId: String,
  products: [{
    productId: String,
    variantName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date
};

// Coupon Schema
export const CouponSchema = {
  id: String,
  code: String,
  discountType: String, // percentage, fixed
  discountValue: Number,
  minPurchase: Number,
  maxUses: Number,
  usedCount: Number,
  validFrom: Date,
  validUntil: Date,
  createdAt: Date,
  updatedAt: Date
};