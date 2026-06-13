# 🏠 Co-Living Platform

A full-stack co-living platform that connects property owners with tenants using **AI-powered semantic search** and **vector-based roommate matching**. Built with React, Node.js, MongoDB, Qdrant, and Google Gemini.

🌐 **Live Demo** → [co-living-two.vercel.app](https://co-living-two.vercel.app)
🔌 **API** → [co-living.up.railway.app](https://co-living.up.railway.app)

---

## ✨ Features

### For Tenants
- 🔍 **AI Semantic Search** — search properties using natural language (e.g. *"quiet pg near metro with wifi"*)
- 🤝 **Roommate Matching** — vector similarity matching finds compatible co-tenants
- ❤️ **Save Properties** — bookmark listings to revisit later
- 📋 **Preference Survey** — multi-step onboarding survey to capture lifestyle and budget preferences
- 🔔 **Real-time Notifications** — toast notifications for property activity
- 🗺️ **Property Map** — explore listings on an interactive map

### For Owners
- 🏗️ **List Properties** — create detailed property listings with photos, amenities and house rules
- 🛏️ **Manage Rooms** — add individual rooms under each property with pricing and availability
- 📊 **Revenue Dashboard** — visualise rental income over time
- 📁 **My Properties** — manage all owned listings in one place

### Platform
- 🔐 **Firebase Auth** — Google sign-in with phone OTP verification (Twilio)
- ⚡ **Redis Caching** — sub-millisecond response times for hot queries
- 🧠 **Gemini Embeddings** — `gemini-embedding-001` (3072-dim) vectors for semantic search
- 🗄️ **Qdrant** — cloud vector database for properties and roommate profiles

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **State / Data** | TanStack Query v5, Axios |
| **Auth** | Firebase Auth, react-firebase-hooks |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database** | MongoDB (Mongoose) |
| **Cache** | Redis |
| **Vector DB** | Qdrant Cloud |
| **AI / Embeddings** | Google Gemini (`@google/genai`) |
| **OTP** | Twilio Verify |
| **Deployment** | Vercel (frontend) · Railway (backend) |

---

## 📁 Project Structure

```
Co-Living/
├── frontend/                    # React + Vite SPA
│   └── src/
│       ├── api/                 # Axios API wrappers per resource
│       ├── components/          # Shared UI components
│       ├── config/              # API base URL, Firebase, data config
│       ├── context/             # UI context / provider
│       ├── hooks/               # TanStack Query hooks
│       ├── pages/
│       │   ├── Home/            # Dashboard, Profile, Owner view
│       │   ├── Login/           # Firebase Google sign-in
│       │   ├── Notification/    # Notification feed
│       │   ├── OnBoarding/      # Multi-step onboarding flow
│       │   ├── property/        # Browse, Detail, Create, Saved, Map
│       │   └── userPropertyPriority/  # Survey, Roommate matching
│       ├── services/            # Auth service, notification helpers
│       └── types/               # TypeScript types per domain
│
└── backend/                     # Express API
    └── src/
        ├── config/              # Qdrant, Gemini, Firebase, Redis, env
        ├── constants/           # UUID namespace
        ├── controllers/         # Request handlers
        ├── db/                  # MongoDB connection
        ├── middleware/          # Auth (Firebase JWT), Redis, Error
        ├── models/              # Mongoose schemas
        ├── routes/              # Express routers
        ├── services/            # Business logic + embedding calls
        ├── types/               # Zod schemas + TypeScript interfaces
        └── utils/               # Redis helpers, error utils
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Redis (local or Upstash)
- Qdrant Cloud account
- Firebase project (Auth enabled)
- Google AI API key (Gemini)
- Twilio account (Verify service)

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` in `/backend`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
MONGO_URL=mongodb://localhost:27017/co-living

REDIS_URL=redis://localhost:6379

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Qdrant
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key

# Google Gemini
GENAI_API_KEY=your-gemini-api-key

# Optional (OpenAI / Ollama fallback)
OPENAI_API_KEY=
OLLAMA_URL=http://localhost:11434/api/embeddings
```

```bash
npm run dev
# Server starts on http://localhost:5000
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` in `/frontend`:

```env
VITE_BACKEND_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

```bash
npm run dev
# App starts on http://localhost:5173
```

---

## 📡 API Reference

All endpoints require a Firebase Bearer token: `Authorization: Bearer <firebase_id_token>`

### Auth — `/api/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Register or login — creates user if first time |
| `GET` | `/me` | Get current user with populated profile |
| `POST` | `/on-boarding` | Complete onboarding (name, role, DOB, phone…) |
| `POST` | `/sendOtp` | Send OTP to phone via Twilio |
| `POST` | `/verifyOtp` | Verify OTP and mark phone as verified |

### Properties — `/api/property`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/get` | List all active properties (Redis cached) |
| `GET` | `/my` | Get owner's own properties |
| `GET` | `/details/:id` | Get single property with owner info |
| `POST` | `/create` | Create property → auto-generates embedding → upserts to Qdrant |
| `POST` | `/search` | Semantic search via Gemini + Qdrant vector similarity |

### Rooms — `/api/room`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/get` | All rooms sorted by rent (Redis cached) |
| `POST` | `/create` | Create room under a property (Owners only) |

### Preferences — `/api/propertyPreference`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/create` | Save tenant preference → generates roommate embedding → upserts to Qdrant |
| `GET` | `/get` | Get own preference profile |
| `PUT` | `/update` | Update preference + re-embed |
| `GET` | `/roommates` | Find compatible roommates via vector similarity |

### Users — `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| `PUT` | `/update` | Update name, bio, email, phone, profile pic |
| `GET` | `/saved` | Get saved properties |
| `POST` | `/saved/:propertyId` | Toggle save/unsave a property |

### Notifications — `/api/notification`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/get` | Get all notifications |
| `GET` | `/new` | Get unread notifications |
| `PUT` | `/read` | Mark notifications as read |

---

## 🧠 How AI Features Work

### Semantic Property Search

When a property is created, the backend builds a rich text document from its name, description, type, location, amenities and rules. This is passed to `gemini-embedding-001` to produce a 3072-dimensional vector, which is upserted to the `properties` collection in Qdrant.

When a tenant searches, the query string is embedded with the same model and compared via cosine similarity in Qdrant, returning the most semantically relevant properties — even if the exact keywords don't match.

```
User query: "quiet place near Koramangala with AC"
    ↓ Gemini embedding
    ↓ Qdrant cosine search (top 20)
    ↓ MongoDB fetch by propertyId
    → Ranked results
```

### Roommate Matching

After tenants complete the preference survey, a lifestyle profile string is built from their gender preference, work mode, food preference, occupancy type, pet-friendliness and preferred locations. This is embedded and stored in the `roomMate` Qdrant collection. The `/roommates` endpoint finds the top matching tenants by vector similarity.

---

## 🌱 Seed Data

A seed script is included to populate the database with realistic dummy data for development and testing.

**Creates:**
- 15 users (10 Tenants + 5 Owners with business profiles)
- 32 properties across Bengaluru, Hyderabad, Pune, Mumbai, Chennai, Delhi
- 50+ rooms (1–3 per property) with varied pricing and availability
- Property preference profiles for all 10 tenants
- Embeddings pushed to both Qdrant collections

**Install dependencies:**
```bash
pip install pymongo google-genai qdrant-client
```

**Run:**
```bash
python seed.py
```

The script auto-deletes previously seeded data before each run. If Qdrant or Gemini is unreachable it falls back gracefully — Qdrant unavailability stores embedding metadata in Mongo, and Gemini unavailability uses deterministic mock vectors.

---

## 🗺️ Frontend Pages

| Route | Page | Access |
|---|---|---|
| `/login` | Google sign-in | Public |
| `/on-boarding` | Multi-step profile setup | Authenticated, incomplete |
| `/home` | Dashboard — properties + rooms | Authenticated |
| `/home/browse` | Filter + explore all listings | Authenticated |
| `/home/property/details/:id` | Property detail + map | Authenticated |
| `/home/create/Property` | List a new property | Owners only |
| `/home/create/Room` | Add room to property | Owners only |
| `/home/survey` | Preference survey | Tenants only |
| `/home/preferences/edit` | Edit preferences | Tenants only |
| `/home/roommates` | Roommate matches | Tenants only |
| `/home/saved` | Saved properties | Authenticated |
| `/home/profile` | User profile | Authenticated |
| `/home/profile/edit` | Edit profile | Authenticated |
| `/home/owner` | Owner analytics | Owners only |
| `/home/messages` | Notification feed | Authenticated |

---

## ⚙️ Environment Variables Summary

### Backend

| Variable | Required | Description |
|---|---|---|
| `PORT` | ✅ | Server port |
| `FRONTEND_URL` | ✅ | CORS allowed origin |
| `MONGO_URL` | ✅ | MongoDB connection string |
| `REDIS_URL` | ✅ | Redis connection string |
| `FIREBASE_PROJECT_ID` | ✅ | Firebase Admin |
| `FIREBASE_CLIENT_EMAIL` | ✅ | Firebase Admin |
| `FIREBASE_PRIVATE_KEY` | ✅ | Firebase Admin |
| `TWILIO_ACCOUNT_SID` | ✅ | Phone OTP |
| `TWILIO_AUTH_TOKEN` | ✅ | Phone OTP |
| `TWILIO_VERIFY_SERVICE_SID` | ✅ | Phone OTP |
| `QDRANT_URL` | ✅ | Vector DB URL |
| `QDRANT_API_KEY` | ✅ | Vector DB API key |
| `GENAI_API_KEY` | ✅ | Gemini embeddings |
| `OPENAI_API_KEY` | ➖ | Optional alternative |
| `OLLAMA_URL` | ➖ | Optional local embeddings |

### Frontend

| Variable | Required | Description |
|---|---|---|
| `VITE_BACKEND_URL` | ✅ | Backend API base URL |
| `VITE_FIREBASE_*` | ✅ | Firebase client config (6 vars) |

---

## 🚢 Deployment

### Frontend → Vercel

1. Connect your GitHub repo to Vercel
2. Set **Framework Preset** to `Vite`
3. Set **Root Directory** to `frontend`
4. Add all `VITE_*` environment variables
5. Deploy

### Backend → Railway

1. Create a new Railway project
2. Connect your GitHub repo
3. Set **Root Directory** to `backend`
4. Add all backend environment variables
5. Railway auto-detects Node.js and runs `npm start`

Ensure `FRONTEND_URL` in Railway matches your Vercel deployment URL for CORS to work.

---

## 📜 License

MIT — see [LICENSE](./LICENSE)