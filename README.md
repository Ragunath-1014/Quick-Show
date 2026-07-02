# QuickShow – Movie Ticket Booking System

QuickShow is a Full Stack Movie Ticket Booking Web Application built using the MERN stack.

It allows users to browse movies, view show timings, select seats in real-time, make secure payments, and track their booking history.

---

## Live Demo
https://quickshow-online.vercel.app

---

## Thumbnail
<img src="frontend/src/assets/images/QuickShowThumbnail.png" alt="QuickShow Thumbnail" width="600">

---

## Preview

### 1. Home Page
<img src="frontend/src/assets/images/HomePage.png" alt="QuickShow Home Page" width="600">

### 2. Movie Detail Page
<img src="frontend/src/assets/images/MovieDetailPage.png" alt="QuickShow Movie Detail Page" width="600">

### 3. Seat Selection Page
<img src="frontend/src/assets/images/SeatSelectionPage.png" alt="QuickShow Seat Selection Page" width="600">

### 4. Review Booking Page
<img src="frontend/src/assets/images/ReviewBookingPage.png" alt="QuickShow Review Booking Page" width="600">

### 5. My Bookings Page
<img src="frontend/src/assets/images/MyBookingsPage.png" alt="QuickShow My Bookings Page" width="600">

---

## Key Highlights

### 1. Smooth Movie Browsing Experience
Users can explore movies with posters, descriptions, language, duration, and certificates in a clean UI.

---

### 2. Smart Theatre Seat System
Seats are generated dynamically based on theatre layout including sections like Platinum, Gold, and Silver.

---

### 3. Real-Time Seat Updates
Seats update instantly for all users using Socket.IO.

If one user selects or locks a seat, others see the update immediately without refreshing the page.

---

### 4. Safe Booking Flow
- Only logged-in users can book tickets
- JWT-based authentication
- Secure API routes and cookie handling

---

### 5. Secure Payment Integration
Razorpay payment gateway is used to handle payments safely.

Bookings are confirmed only after successful payment verification.

---

### 6. Booking History
Users can view all their past bookings with full details like:
- Movie name
- Theatre
- Seats
- Time

---

### 7. Fully Responsive Design
The entire app works smoothly on:
- Mobile phones
- Tablets
- Desktop screens

Seat layout and UI automatically adjust based on screen size.

---

## Technical Challenges & Solutions

While building this project, I encountered several real-world development challenges related to data handling, state management, API integration, and user experience. Each challenge provided valuable learning opportunities and helped me improve my problem-solving and full-stack development skills.

---

### 1. Dynamic Seat Generation System

**Challenge:**
One of the earliest challenges was designing a scalable theatre seating structure. Instead of manually creating hundreds of seats, I needed a way to generate seats dynamically while supporting multiple pricing categories and row configurations.

**Solution:**
I designed a seat generation algorithm that automatically creates:

- Multiple seating sections (Platinum, Gold, Silver)
- Rows (A–L)
- Seat numbers (A1, A2, etc.)

This made the system flexible and easy to extend.

---

### 2. Responsive Seat Selection UI

**Challenge:**
Displaying hundreds of seats properly on all screen sizes was difficult.

The layout needed to:
- Stay aligned like a real theatre
- Work on mobile, tablet, and desktop
- Keep proper spacing between seats
- Handle horizontal scrolling on small screens

**Solution:**
Built a custom seat rendering UI using React + Tailwind CSS:

- Used responsive sizing for seats
- Added horizontal scroll for small screens
- Kept row-wise and section-wise structure
- Adjusted spacing dynamically for better readability
- Maintained a center gap between seat blocks to match real theatre layout

This ensured a smooth and consistent experience across all devices.

---

### 3. Organizing Shows by Date and Theatre

**Challenge:**
The API returned raw show data, which was hard to display directly in the UI.

**Solution:**
Created a backend grouping system that organizes data into:

- Date → Theatre → Show Timings

This removed unnecessary repetition and made frontend rendering simple and clean.

---

### 4. Real-Time Seat Synchronization

**Challenge:**
Multiple users selecting seats at the same time could lead to conflicts.

**Solution:**
I learned and integrated Socket.IO to update seat status instantly across all connected users.

Whenever a seat changes:
- Server emits an event
- All users see updated seat availability in real-time

---

### 5. Seat Locking System (Prevent Double Booking)

**Challenge:**
Two users could select the same seat and proceed at the same time.

**Solution:**
Implemented a seat locking system:

- When user proceeds, selected seats are marked as "Locked"
- Locked seats are assigned to that user
- Other users cannot select them
- If conflict happens, a warning modal is shown

---

### 6. Temporary Seat Reservation (5 Minutes)

**Challenge:**
Users may leave after selecting seats without completing payment.

**Solution:**
Seats are locked for only 5 minutes.

If payment is not completed:
- Seats are automatically released
- They become available again

---

### 7. Auto Recovery System for Locked Seats

**Challenge:**
Even though seats are released when users leave the booking flow, I wanted an additional safety mechanism in case a release operation fails unexpectedly.

**Solution:**
I built an automatic seat recovery service using a scheduled background process.

Every few seconds:

- Checks all shows every few seconds
- Finds seats locked for more than 5 minutes
- Automatically releases them
- Updates all users in real-time

This acts as a safety backup system.

---

## Tech Stack

### Frontend
- React.js
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- React Toastify

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO
- JWT Authentication

### Other Tools
- Razorpay Payment Gateway
- Dotenv
- Cookie-parser
- CORS

---

## Future Improvements

- Admin dashboard for managing movies and shows
- Email booking confirmations
- Google login (OAuth)
- Theatre seat layout customization panel
- Location-based movie suggestions
- Booking analytics dashboard

---

## Author

**Ragunath S**

GitHub: https://github.com/Ragunath-1014

---

⭐ If you like this project, please consider giving it a star on GitHub!