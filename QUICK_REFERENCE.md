# 🎬 MovieFlix - Quick Reference Card

## 📂 Project Location
```
C:\Users\manik\OneDrive\Desktop\github\FP
```

## ⚡ Quick Commands

### Setup (First Time Only)
```powershell
cd backend
npm install
npm run seed
npm start
```

### Daily Development
```powershell
npm start                # Start server
npm run dev             # Start with auto-reload
npm run seed            # Reseed database
```

### Browser Access
```
http://localhost:5000
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express app entry point |
| `frontend/index.html` | All 5 pages |
| `frontend/css/styles.css` | All styling & gradients |
| `frontend/js/app.js` | Core logic |
| `backend/data/seedData.js` | Movie database |

## 🎨 Page Structure

| Page | File | Content |
|------|------|---------|
| 1 | `index.html` | Language selection (4 options) |
| 2 | `index.html` | Age rating (6 options) |
| 3 | `index.html` | Genre (4 options) |
| 4 | `index.html` | OTT platform (4 options) |
| 5 | `index.html` | Movie results (grid display) |

## 🔌 API Endpoints

```
GET /api/movies/filter?language=Telugu&age=13+&genre=Action&ott=Netflix
GET /api/movies/options
GET /api/movies/search?query=movie
GET /api/movies/:id
```

## 💾 Database

- **Database**: movie-recommendations
- **Collection**: movies
- **Records**: 512+

## 🎯 Features Implemented

- ✅ 5-step filtering wizard
- ✅ Dark mode toggle
- ✅ Responsive design (all devices)
- ✅ Gradient animations
- ✅ Movie recommendations
- ✅ LocalStorage persistence
- ✅ Loading animations
- ✅ Modal details view
- ✅ Error handling
- ✅ Clean UI/UX

## 🛠️ Customization Quick Links

**Add Movies**: Edit `backend/data/seedData.js` → Add to sampleMovies array → `npm run seed`

**Change Colors**: Edit `frontend/css/styles.css` → Modify `:root` variables

**Update Text**: Edit `frontend/index.html` → Change titles/descriptions

**API Changes**: Edit `backend/controllers/movieController.js`

## 📊 Database Schema

```javascript
{
  title: String,
  poster: String (URL),
  plot: String,
  trailer: String (YouTube URL),
  detailsLink: String (IMDb URL),
  language: String,      // Telugu, Hindi, English, Others
  age: String,          // All, U/A, 13+, 16+, 18+, A
  genre: String,        // Action, Romance, Comedy, Thriller/Crime
  ott: String,          // Hotstar, Netflix, Prime Video, Others
  rating: Number,       // 0-10
  year: Number,
  createdAt: Date
}
```

## 🎓 Tech Stack

```
Frontend:  HTML5, CSS3, JavaScript (no frameworks)
Backend:   Node.js, Express.js
Database:  MongoDB, Mongoose
Styling:   CSS Gradients, Keyframe animations
State:     LocalStorage
```

## 📝 Documentation Files

1. **README.md** - Complete project documentation
2. **SETUP.md** - Setup instructions
3. **GETTING_STARTED.md** - Quick start guide
4. **PROJECT_CHECKLIST.md** - Feature verification
5. **QUICK_REFERENCE.md** - This file

## 🚀 Deployment

To deploy:
1. Set up MongoDB Atlas account
2. Update MONGODB_URI in .env
3. Change NODE_ENV to production
4. Deploy to Heroku/Vercel/AWS
5. Update MongoDB IP whitelist

## 🔐 Security

- ✅ Input validation
- ✅ Error handling
- ✅ CORS enabled
- ✅ Environment variables protected
- ✅ Mongoose prevents injection

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768-1199px
- Mobile: <768px
- Small Mobile: <480px

## 🎨 Gradient Colors

- Page 1: Purple → Pink → Blue → Purple
- Page 2: Pink → Yellow → Cyan → Purple
- Page 3: Teal → Pink → Red → Purple
- Page 4: Orange → Pink → Purple → Cyan
- Page 5: Yellow → Pink → Dark Blue → Cyan

## 🔄 Workflow

1. **Select filters** → Stored in localStorage
2. **Click Get Recommendations** → API query
3. **Results display** → Movies matching all filters
4. **Click trailer/details** → Modal opens
5. **Start over** → Reset and begin again

## 💡 Pro Tips

```javascript
// Clear all selections
localStorage.clear()

// View current selections
console.log(userSelections)

// Change port
// Edit backend/.env: PORT=3000

// Use SSH for MongoDB
// Update MONGODB_URI in .env
```

## ⚠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| Port conflict | Change PORT in .env |
| MongoDB down | Start mongod or use Atlas |
| No movies | Run npm run seed |
| Styling broken | Check frontend/css/styles.css |
| API 404 | Check backend/routes/movies.js |

## 📞 Quick Support

- **Dev Mode**: `npm run dev` (auto-restart)
- **Check Errors**: Open browser DevTools (F12)
- **DB Viewer**: Use MongoDB Compass
- **API Test**: Use Postman

## 🎯 Next Steps

1. ✅ Start server (npm start)
2. ✅ Test all pages
3. ✅ Customize movies
4. ✅ Deploy online
5. ✅ Share portfolio link

---

**Ready to run? Type:** `npm start` 🚀

**Status**: ✅ Production Ready
