# 🌬️ Breeze Travel

A full-stack Airbnb-inspired travel listing app built with **React.js, Node.js, Express.js, and MongoDB**.

> Built by **Shruti Kumari** — Full-Stack Software Developer

---

## ✨ Features

- 🏡 Browse travel listings with search, category filters, price & guest filters
- 📄 Detailed listing pages with amenities, host info, and photo
- 📅 Booking system — select dates, calculate price, confirm booking
- 👤 User authentication — Register, Login, JWT-based sessions
- ➕ Create your own listings
- 📋 My Bookings page — view & cancel bookings
- 🌱 One-click sample data seeder (8 Indian destinations)

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js 18, React Router v6, Axios |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB (Mongoose ODM)            |
| Auth      | JWT (jsonwebtoken), bcryptjs      |
| Styling   | Custom CSS, Google Fonts          |

---

## 🚀 Local Setup

### 1. Clone the project
```bash
git clone https://github.com/YOUR_USERNAME/breeze-travel.git
cd breeze-travel
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your MongoDB URI
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

App runs at: **http://localhost:3000**
API runs at: **http://localhost:5000**

### 4. Seed Sample Data
After starting the backend, click **"Load Sample Listings"** on the homepage,
or hit the endpoint directly:
```
POST http://localhost:5000/api/listings/seed/data
```

---

## 🌐 Deployment

### Backend → Render (Free)

1. Go to [render.com](https://render.com) → New → Web Service
2. Connect your GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add Environment Variables:
   - `MONGO_URI` = your MongoDB Atlas connection string
   - `JWT_SECRET` = any long random string
   - `CLIENT_URL` = your Vercel frontend URL (after deploying frontend)
5. Click **Deploy**

### Frontend → Vercel (Free)

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
3. Add Environment Variable:
   - `REACT_APP_API_URL` = your Render backend URL (e.g. `https://breeze-travel-api.onrender.com/api`)
4. Click **Deploy**

### MongoDB → MongoDB Atlas (Free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Create a database user
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Copy the connection string → paste in Render's `MONGO_URI`

---

## 📁 Project Structure

```
breeze-travel/
├── backend/
│   ├── models/
│   │   ├── Listing.js
│   │   ├── User.js
│   │   └── Booking.js
│   ├── routes/
│   │   ├── listings.js   (CRUD + search + seed)
│   │   ├── auth.js       (register, login, me)
│   │   └── bookings.js   (create, view, cancel)
│   ├── middleware/
│   │   └── auth.js       (JWT verification)
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   └── ListingCard.js
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── ListingDetail.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── MyBookings.js
    │   │   └── CreateListing.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── App.js
    │   ├── App.css
    │   └── index.js
    └── package.json
```

---

## 🔗 API Endpoints

| Method | Endpoint                    | Auth | Description          |
|--------|-----------------------------|------|----------------------|
| GET    | /api/listings               | No   | Get all listings     |
| GET    | /api/listings/:id           | No   | Get single listing   |
| POST   | /api/listings               | Yes  | Create listing       |
| PUT    | /api/listings/:id           | Yes  | Update listing       |
| DELETE | /api/listings/:id           | Yes  | Delete listing       |
| POST   | /api/listings/seed/data     | No   | Seed sample data     |
| POST   | /api/auth/register          | No   | Register user        |
| POST   | /api/auth/login             | No   | Login user           |
| GET    | /api/auth/me                | Yes  | Get current user     |
| POST   | /api/bookings               | Yes  | Create booking       |
| GET    | /api/bookings/my            | Yes  | Get my bookings      |
| DELETE | /api/bookings/:id           | Yes  | Cancel booking       |

---

*Built with ❤️ by Shruti Kumari — Full-Stack Software Developer*
