# Local Notice Board Platform

A hyperlocal MERN app combining business advertisements and community notices —
built to fulfill the PRD's Phase 1 scope: auth, business ads, community notices,
location-based discovery, engagement (like/comment/share/save/report), and an
admin panel.

Architecture note: Ads and Notices share a single `Post` model (differentiated
by a `type` field), so there's one Discovery/Feed engine instead of two parallel
ones. See `/server/models/Post.js`.

---

## 1. Local Setup

### Backend
```bash
cd server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, Cloudinary keys
npm run seed            # loads realistic demo data (admin login printed to console)
npm run dev              # starts on http://localhost:5000
```

### Frontend
```bash
cd client
npm install
cp .env.example .env   # VITE_API_URL should point at your backend
npm run dev              # starts on http://localhost:5173
```

You need a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
(get `MONGO_URI` from there) and a free [Cloudinary](https://cloudinary.com/)
account (for `CLOUDINARY_*` keys, used for ad/notice images).

After seeding, log in as:
- **Admin:** `admin@noticeboard.local` / `admin1234`
- **Resident:** `ritika@example.com` / `password123`
- **Business owner:** `anil@primetailors.local` / `password123`

---

## 2. What's Implemented (maps to the PRD)

| PRD Module | Where |
|---|---|
| User registration & login | `/server/routes/authRoutes.js`, `/client/src/pages/Login.jsx`, `Register.jsx` |
| Business profile + ad CRUD | `businessRoutes.js`, `postController.js`, `/client/src/pages/BusinessProfile.jsx`, `CreatePost.jsx` |
| Community notice CRUD | `postController.js` (`type: 'notice'`), `CreatePost.jsx` |
| Location-based discovery, search, category filter | `feedRoutes.js` → `getFeed`, `/client/src/pages/Feed.jsx` |
| Engagement (like/comment/share/save/report) | `engagementController.js`, `/client/src/pages/PostDetail.jsx` |
| Admin: manage users, moderate, view reports, analytics | `adminController.js`, `/client/src/pages/AdminPanel.jsx` |
| Realistic seed data | `/server/utils/seed.js` |

Out of scope (per PRD Phase 1): paid ads, ad-targeting algorithms, native mobile app.

---

## 3. Deployment

**Backend → Render or Railway**
1. Push `/server` to its own GitHub repo (or a subfolder deploy).
2. New Web Service → connect repo → build command `npm install`, start command `npm start`.
3. Add env vars: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL` (your Vercel URL once you have it), `CLOUDINARY_*`.
4. Note the deployed backend URL, e.g. `https://noticeboard-api.onrender.com`.

**Frontend → Vercel**
1. Push `/client` to GitHub (or same repo, different root directory).
2. Import into Vercel → framework preset "Vite".
3. Env var: `VITE_API_URL=https://noticeboard-api.onrender.com/api`.
4. Deploy. Note the URL, e.g. `https://noticeboard.vercel.app`.

**Close the loop:** go back to Render/Railway and update `CLIENT_URL` to your
Vercel URL (needed for CORS), then redeploy the backend.

**Database → MongoDB Atlas**
- Free M0 cluster. Network Access → allow `0.0.0.0/0` (or Render's static IP
  if you've enabled one) so the deployed backend can reach it.

---

## 4. Deployment Checklist (from the build capsule)
- [ ] Env vars set on both Render/Railway and Vercel (never committed)
- [ ] Atlas IP whitelist allows the deployed backend
- [ ] CORS `CLIENT_URL` matches the live Vercel domain exactly
- [ ] Cloudinary upload tested from the *deployed* frontend, not just localhost
- [ ] `npm run seed` run against the production DB (or your own realistic data)
- [ ] Report → Admin → resolve flow tested end-to-end on the live site
- [ ] Final live link opened in a fresh/incognito browser and smoke-tested

---

## 5. Project Structure
```
notice-board/
├── server/
│   ├── config/       (db.js, cloudinary.js)
│   ├── models/       (User, Business, Post, Report)
│   ├── controllers/  (auth, business, post, engagement, admin)
│   ├── routes/
│   ├── middleware/   (auth, upload, errorHandler)
│   ├── utils/seed.js
│   └── server.js
└── client/
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.jsx
        ├── components/ (Navbar, PostCard, ProtectedRoute)
        ├── pages/ (Feed, Login, Register, PostDetail, CreatePost,
        │           BusinessProfile, AdminPanel, SavedPosts)
        └── App.jsx
```
