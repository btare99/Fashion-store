# 👗 Fashion Store - Modern E-commerce Platform

A premium, full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). This platform features a sleek, modern UI with smooth animations, a robust admin dashboard, and a seamless shopping experience.

![Fashion Store Banner](https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## ✨ Features

### 🛍️ Frontend (Customer Facing)
- **Modern UI/UX**: Built with React and Framer Motion for premium animations and transitions.
- **Product Discovery**: Browse products by categories with a responsive grid layout.
- **Shopping Cart**: Real-time cart management with local persistence.
- **Wishlist**: Save favorite items for later.
- **Detailed Product Pages**: High-quality imagery, descriptions, and price tracking.
- **Seamless Checkout**: Streamlined ordering process with success notifications.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.

### 🔐 Admin Dashboard
- **Product Management**: Create, Update, and Delete products with image support (Multer).
- **Order Tracking**: View and manage customer orders in real-time.
- **Category Management**: Organize products into logical collections.
- **Secure Login**: Protected admin routes using JWT authentication.

### 🛠️ Backend & Integration
- **RESTful API**: Robust Express.js backend handling all business logic.
- **Database**: Scalable MongoDB integration with Mongoose schemas.
- **Email Notifications**: Automated email alerts for new orders via Nodemailer.
- **File Uploads**: Local image storage handling using Multer.

## 🚀 Tech Stack

**Frontend:**
- React.js (Vite)
- Framer Motion (Animations)
- React Router (Routing)
- Axios (API Calls)
- React Hot Toast (Notifications)
- CSS3 (Vanilla + Modern Variables)

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt.js (Encryption)
- Multer (File Handling)
- Nodemailer (Email)

## 🛠️ Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/btare99/Fashion-store.git
cd Fashion-store
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
```
Run the seed script (optional, to populate data):
```bash
node seed.js
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The application will be running at `http://localhost:5173` (Frontend) and `http://localhost:5000` (Backend).

## 📁 Project Structure

```text
Fashion-store/
├── backend/                # Express API
│   ├── models/             # Mongoose Schemas
│   ├── routes/             # API Endpoints
│   ├── utils/              # Helpers (Email, etc.)
│   ├── uploads/            # Product Images
│   └── server.js           # Entry point
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # State Management
│   │   ├── pages/          # Page views
│   │   ├── services/       # API integration
│   │   └── App.jsx         # Routing
│   └── package.json
└── README.md
```

## 📜 License
This project is licensed under the MIT License.

---
Built with ❤️ by [btare99](https://github.com/btare99)
