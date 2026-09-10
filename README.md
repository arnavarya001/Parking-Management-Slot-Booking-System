# 🚗 PS 08 — Parking Management & Slot Booking System

A full-stack web application designed for urban mobility and facility management. It allows users to browse and book available parking slots based on vehicle type and duration, while providing administrators with complete management over parking slots, zones, bookings, and live occupancy analytics.

---

## 📋 Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Tech Stack](#-tech-stack)
3. [Key Features](#-key-features)
4. [System Architecture & Database Schema](#-system-architecture--database-schema)
5. [API Endpoints](#-api-endpoints)
6. [Installation & Setup](#-installation--setup)
7. [Default Demo Credentials](#-default-demo-credentials)
8. [Project Structure](#-project-structure)

---

## 📌 Problem Statement

**Domain:** Urban Mobility / Facility Management  
**Objective:** Manage and book parking slots for apartments, offices, malls, or public parking facilities with real-time availability tracking and conflict-free time-based slot allocation.

---

## 🛠 Tech Stack

- **Frontend:** React.js (Component-based architecture, JSX, `useState`, `useEffect`, React Router DOM)
- **Backend:** Node.js & Express.js (RESTful API architecture)
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) with hashed passwords using `bcryptjs`
- **Styling:** Vanilla CSS (Responsive, clean, student-level design)
- **Version Control:** Git & GitHub

---

## ✨ Key Features

### 👤 User Capabilities
- **Browse Slots:** View available parking spots along with slot number, location, vehicle type, and zone.
- **Filter Slots:** Filter slots by location (e.g., Ground Floor, Basement) and vehicle type (Car, Bike, EV).
- **Time-based Slot Booking:** Select start and end date/time to book a slot.
- **Conflict Prevention (Stretch Goal):** Prevents double-booking by checking overlapping active reservations for the requested time range.
- **Booking History:** View current and past bookings with real-time status (`active`, `cancelled`, `completed`).
- **Cancellation:** Users can cancel their own active reservations at any time.

### 🛡 Admin Capabilities
- **Overview Dashboard:**
  - Real-time count of Available vs Occupied slots.
  - Total bookings made today.
  - Zone-wise occupancy table (Total, Occupied, Available).
- **Slot Management:**
  - Add new parking slots with slot number, location, vehicle type, and assigned zone.
  - Edit existing parking slot details.
  - Block/Unblock slots (blocked slots are automatically hidden from normal user booking).
  - Delete parking slots.
- **Zone Management:**
  - Create and manage parking zones (e.g., Zone A, VIP Section).
  - Edit and delete zones.
- **Booking Monitoring:**
  - View all user bookings across the system with user details and timestamps.

---

## 🗄 System Architecture & Database Schema

### 1. User Model (`User.js`)
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, hashed using bcrypt)
- `role` (String, enum: `['user', 'admin']`, default: `'user'`)

### 2. Zone Model (`Zone.js`)
- `name` (String, required)
- `location` (String, required)

### 3. ParkingSlot Model (`ParkingSlot.js`)
- `slotNumber` (String, required, unique)
- `location` (String, required)
- `type` (String, required: `Car`, `Bike`, `EV`)
- `zone` (ObjectId ref to `Zone`)
- `status` (String, enum: `['available', 'blocked']`, default: `'available'`)

### 4. Booking Model (`Booking.js`)
- `user` (ObjectId ref to `User`)
- `slot` (ObjectId ref to `ParkingSlot`)
- `startTime` (Date, required)
- `endTime` (Date, required)
- `status` (String, enum: `['active', 'cancelled', 'completed']`, default: `'active'`)
- `createdAt` (Date, default: `Date.now`)

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user or admin |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/slots` | Public / Auth | Get parking slots (supports `?location=&type=` query filters) |
| `POST` | `/api/slots` | Admin | Create a new parking slot |
| `PUT` | `/api/slots/:id` | Admin | Edit slot details |
| `PUT` | `/api/slots/:id/status`| Admin | Block or unblock a slot |
| `DELETE`| `/api/slots/:id` | Admin | Delete a slot |
| `GET` | `/api/zones` | Public / Auth | List all parking zones |
| `POST` | `/api/zones` | Admin | Add a new parking zone |
| `PUT` | `/api/zones/:id` | Admin | Edit zone details |
| `DELETE`| `/api/zones/:id` | Admin | Delete a zone |
| `POST` | `/api/bookings` | User | Book a slot with start/end time (conflict-checked) |
| `GET` | `/api/bookings/my` | User | Get current logged-in user's bookings |
| `PUT` | `/api/bookings/:id/cancel`| User | Cancel a booking |
| `GET` | `/api/bookings` | Admin | View all system bookings |
| `GET` | `/api/dashboard` | Admin | Get dashboard metrics and zone occupancy |

---

## 🚀 Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)

### 1. Clone the Repository
```bash
git clone https://github.com/arnavarya001/Parking-Management-Slot-Booking-System.git
cd Parking-Management-Slot-Booking-System
```

### 2. Install Dependencies
Install client and server dependencies:
```bash
# Install root & client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

### 3. Setup Environment Variables
In the `server/` directory, create a `.env` file (refer to `.env.example`):
```env
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5001
JWT_SECRET=your_jwt_secret_key
```

### 4. (Optional) Seed Sample Data
To populate sample zones, parking slots, and admin/user accounts:
```bash
cd server
node seed.js
cd ..
```

### 5. Run the Application

You can run both client and server from the root directory:

**Terminal 1 — Backend:**
```bash
npm run server
```
*Server starts on `http://localhost:5001`*

**Terminal 2 — Frontend:**
```bash
npm run dev
```
*Frontend opens at `http://localhost:5173`*

---

## 🔑 Default Demo Credentials

If you seeded the database with `node server/seed.js`, you can immediately log in with:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@parking.com` | `admin123` |
| **User** | `user@parking.com` | `user123` |

*(You can also create new users or admins anytime via the Register tab on the login page).*

---

## 📂 Project Structure

```text
Parking-Management-Slot-Booking-System/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar)
│   │   ├── pages/              # Views (UserDashboard, MyBookings, AdminDashboard, ManageSlots, ManageZones, AllBookings, Login)
│   │   ├── App.jsx             # Main routing and navigation
│   │   ├── api.js              # API configuration
│   │   ├── style.css           # Global custom stylesheet
│   │   └── main.jsx            # React root entry
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js + Express Backend
│   ├── config/
│   ├── middleware/             # JWT auth and admin check middleware
│   ├── models/                 # Mongoose schemas (User, ParkingSlot, Zone, Booking)
│   ├── routes/                 # REST API route handlers
│   ├── seed.js                 # Sample database seed script
│   ├── app.js                  # Express application entry
│   ├── .env.example            # Environment configuration template
│   └── package.json
├── .gitignore                  # Git ignore rules (protects credentials)
├── package.json                # Root package configuration
└── README.md                   # Project documentation
```
