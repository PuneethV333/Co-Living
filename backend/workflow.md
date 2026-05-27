# Co-Living Platform - Backend Development Workflow

## 🎯 Overall Development Strategy

```
Phase 1: Foundation (Day 1-2)
  ├─ Schema Design ✅ (TODAY)
  ├─ Basic CRUD APIs
  └─ Authentication Setup

Phase 2: Core Features (Day 3-4)
  ├─ Search & Filter APIs
  ├─ Booking Management
  └─ Compatibility Matching

Phase 3: Advanced (Day 5-6)
  ├─ Admin Dashboard APIs
  ├─ Caching Strategy
  └─ Performance Optimization

Phase 4: Frontend Integration
  └─ Connect all APIs
```

---

## 📅 TODAY'S TASK (Phase 1 - Day 1)

### Your Tasks for Today:

#### 1. **Create Database Schemas** ✅
Create the following MongoDB schemas in `src/models/`:

**Models to create:**
- [ ] User.js (Tenant, Owner, Admin)
- [ ] Property.js (Listings with rooms)
- [ ] Room.js (Individual rooms in property)
- [ ] Booking.js (Booking requests)
- [ ] Amenity.js (Predefined amenities)
- [ ] RoommatePreference.js (User preferences)

#### 2. **Create Controllers** ✅
Create the following in `src/controllers/`:

- [ ] userController.js
- [ ] propertyController.js
- [ ] bookingController.js
- [ ] amenityController.js

#### 3. **Create Routes** ✅
Create the following in `src/routes/`:

- [ ] users.js
- [ ] properties.js
- [ ] bookings.js
- [ ] amenities.js

#### 4. **Test Endpoints** ✅
Use Postman/Insomnia to test all CRUD endpoints

---

## 📊 SCHEMA STRUCTURE (Reference)

### 1. **User Schema**
```
User {
  _id: ObjectId
  firebaseUID: String (unique)
  email: String
  name: String
  role: String (enum: "tenant", "owner", "admin")
  
  // Profile
  phone: String
  profilePicture: String
  bio: String
  verified: Boolean (default: false)
  
  // For Tenants
  occupationStatus: String (student/working-professional/other)
  income: Number (optional)
  
  // For Owners
  businessName: String (optional)
  propertiesCount: Number (default: 0)
  
  // Preferences (for matching)
  preferences: {
    genderPreference: String,
    budgetRange: { min, max },
    preferredAmenities: [String],
    preferredLocations: [String],
    workingHours: String,
    smokingAllowed: Boolean,
    petsAllowed: Boolean,
  }
  
  timestamps: true
}
```

### 2. **Property Schema**
```
Property {
  _id: ObjectId
  ownerId: ObjectId (ref: User)
  name: String
  description: String
  
  location: {
    address: String
    city: String
    state: String
    zipCode: String
    coordinates: {
      lat: Number
      lng: Number
    }
  }
  
  // Property Details
  propertyType: String (apartment/house/condo)
  totalRooms: Number
  totalBedrooms: Number
  totalBathrooms: Number
  builtUpArea: Number
  
  // Amenities
  amenities: [String] (ref: Amenity)
  rules: [String]
  
  // Images
  photos: [String] (URLs)
  
  // Status
  verified: Boolean (default: false)
  isActive: Boolean (default: true)
  rating: Number (default: 0)
  totalReviews: Number (default: 0)
  
  timestamps: true
}
```

### 3. **Room Schema**
```
Room {
  _id: ObjectId
  propertyId: ObjectId (ref: Property)
  
  roomDetails: {
    roomType: String (enum: "shared", "private")
    capacity: Number
    bedType: String (single/double/bunk)
    area: Number (sq ft)
  }
  
  pricing: {
    monthlyRent: Number
    securityDeposit: Number
    maintenanceCharges: Number (optional)
  }
  
  // Room-specific amenities
  amenities: [String]
  
  // Availability
  availability: {
    startDate: Date
    endDate: Date (null = ongoing)
    currentOccupants: Number (default: 0)
  }
  
  photos: [String]
  
  timestamps: true
}
```

### 4. **Booking Schema**
```
Booking {
  _id: ObjectId
  tenantId: ObjectId (ref: User)
  propertyId: ObjectId (ref: Property)
  roomId: ObjectId (ref: Room)
  ownerId: ObjectId (ref: User)
  
  // Booking Details
  status: String (enum: "pending", "approved", "rejected", "active", "completed", "cancelled")
  requestMessage: String
  appliedOn: Date
  
  // Move-in/Move-out
  moveInDate: Date (requested)
  moveOutDate: Date (null = indefinite)
  
  // Compatibility
  compatibilityScore: Number (0-100)
  
  // Admin
  adminNotes: String
  
  timestamps: true
}
```

### 5. **RoommatePreference Schema**
```
RoommatePreference {
  _id: ObjectId
  userId: ObjectId (ref: User)
  
  preferences: {
    genderPreference: String (any/male/female)
    ageRange: { min, max }
    occupationPreference: [String]
    smokingTolerance: Boolean
    petTolerance: Boolean
    nightOwl: Boolean
    cleanliness: String (1-5 scale)
    socialPreference: String (quiet/moderate/social)
    dietaryPreference: String (veg/non-veg/any)
  }
  
  dealBreakers: [String] (array of things they won't tolerate)
  
  timestamps: true
}
```

### 6. **Amenity Schema**
```
Amenity {
  _id: ObjectId
  name: String (unique)
  category: String (kitchen/bathroom/bedroom/common/safety)
  icon: String (emoji or icon name)
  description: String
  
  timestamps: true
}
```

---

## 🔄 API ENDPOINTS STRUCTURE (What You'll Build Today)

### Users API
```
POST   /api/users/register              // Create user (Firebase handles)
GET    /api/users/:userId               // Get user profile
PUT    /api/users/:userId               // Update profile
PUT    /api/users/:userId/preferences   // Update preferences
GET    /api/users/:userId/completeness  // Profile completion %
```

### Properties API
```
POST   /api/properties                  // Create property (Owner only)
GET    /api/properties                  // List all properties (with filters)
GET    /api/properties/:propertyId      // Get property details
PUT    /api/properties/:propertyId      // Update property (Owner only)
DELETE /api/properties/:propertyId      // Delete property (Owner only)
GET    /api/properties/:propertyId/rooms // Get all rooms in property
GET    /api/properties/owner/:ownerId   // Get owner's properties
```

### Rooms API
```
POST   /api/properties/:propertyId/rooms        // Add room to property
GET    /api/properties/:propertyId/rooms/:roomId // Get room details
PUT    /api/properties/:propertyId/rooms/:roomId // Update room
DELETE /api/properties/:propertyId/rooms/:roomId // Delete room
```

### Bookings API
```
POST   /api/bookings                    // Create booking request
GET    /api/bookings/user/:userId       // Get user's bookings
GET    /api/bookings/property/:propertyId // Get property's booking requests
PUT    /api/bookings/:bookingId         // Update booking status
DELETE /api/bookings/:bookingId         // Cancel booking
```

### Amenities API
```
GET    /api/amenities                   // Get all amenities (cached)
POST   /api/amenities                   // Add amenity (Admin only)
```

---

## ✅ TODAY'S DELIVERABLES

By end of today, you should have:

1. ✅ All 6 Schemas created and ready
2. ✅ All controllers with basic CRUD logic
3. ✅ All routes connected
4. ✅ Firebase Auth middleware working
5. ✅ Test file or Postman collection with all endpoints tested

---

## 📝 SCHEMA CREATION CHECKLIST

For each schema, follow this structure:

```javascript
// Example: User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // fields here
}, { 
  timestamps: true,
  collection: 'users'
});

// Add indexes for frequently queried fields
userSchema.index({ firebaseUID: 1 });
userSchema.index({ email: 1 });

// Export model
export default mongoose.model('User', userSchema);
```

---

## 🎯 CONTROLLER STRUCTURE

For each controller, follow this pattern:

```javascript
// Example: userController.js

export const getUserProfile = async (req, res) => {
  try {
    // Logic here
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // Validation
    // Update logic
    // Return updated data
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export all
export default {
  getUserProfile,
  updateUserProfile,
  // ... other methods
};
```

---

## 🔌 ROUTER STRUCTURE

For each route, follow this pattern:

```javascript
// Example: users.js
import express from 'express';
import { authenticateToken, roleMiddleware } from '../middleware/authMiddleware.js';
import userController from '../controllers/userController.js';

const router = express.Router();

// Public routes
router.get('/:userId', userController.getUserProfile);

// Protected routes (require authentication)
router.put('/:userId', authenticateToken, userController.updateUserProfile);
router.put('/:userId/preferences', authenticateToken, userController.updatePreferences);

// Admin only routes
router.get('/', authenticateToken, roleMiddleware(['admin']), userController.getAllUsers);

export default router;
```

---

## 🚀 PRIORITY TODAY

### Must Complete:
1. **User Schema** ⭐⭐⭐
2. **Property Schema** ⭐⭐⭐
3. **Room Schema** ⭐⭐⭐
4. **Booking Schema** ⭐⭐
5. **Basic CRUD for Users** ⭐⭐⭐
6. **Basic CRUD for Properties** ⭐⭐⭐

### Can Skip for Now:
- Amenity management
- Complex filtering
- Caching
- Admin endpoints

---

## 🧪 TESTING ENDPOINTS TODAY

Once you create the controllers and routes, test these:

```
1. POST /api/users/profile (create user profile after Firebase auth)
2. GET /api/users/:userId
3. PUT /api/users/:userId
4. POST /api/properties (owner creates property)
5. GET /api/properties
6. GET /api/properties/:propertyId
7. POST /api/properties/:propertyId/rooms
8. POST /api/bookings
9. GET /api/bookings/user/:userId
```

---

## 📦 PROJECT STRUCTURE TODAY

Your backend folder should look like:
```
src/
├── models/
│   ├── User.js ✅
│   ├── Property.js ✅
│   ├── Room.js ✅
│   ├── Booking.js ✅
│   ├── Amenity.js ✅
│   └── RoommatePreference.js ✅
│
├── controllers/
│   ├── userController.js ✅
│   ├── propertyController.js ✅
│   ├── roomController.js ✅
│   └── bookingController.js ✅
│
├── routes/
│   ├── users.js ✅
│   ├── properties.js ✅
│   ├── rooms.js ✅
│   └── bookings.js ✅
│
├── middleware/
│   ├── authMiddleware.js (already provided)
│   └── errorHandler.js
│
├── utils/
│   ├── firebaseAdmin.js
│   └── redisClient.js
│
├── app.js
└── server.js
```

---

## 💡 QUICK TIPS

1. **Use Lean Queries**: `User.find().lean()` for faster reads
2. **Error Handling**: Always use try-catch and return proper status codes
3. **Validation**: Validate input before saving to DB
4. **Indexes**: Add indexes to frequently queried fields
5. **Timestamps**: Always use `timestamps: true` in schemas

---

## 🎯 NEXT STEPS AFTER TODAY

Tomorrow:
- Add Firebase authentication verification
- Add input validation
- Add search & filter APIs
- Add Redis caching

Then:
- Frontend integration
- Testing & debugging

---

**Share your schema code when ready! I'll review and we can iterate. After that, show me your controllers & routes, then we'll build the UI together.** 💪