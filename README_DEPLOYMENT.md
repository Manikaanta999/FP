# 🎬 CinemaFlow - Premium Movie Discovery Platform

> A modern, production-ready movie discovery app inspired by IMDb with real TMDB API integration, glassmorphism UI, and full responsive design.

## ⚡ Quick Start (3 Steps)

```bash
# 1. Get TMDB API Key
# Visit: https://www.themoviedb.org/settings/api

# 2. Setup Backend
cd backend
npm install
# Edit .env with your API key
npm start

# 3. Visit in Browser
# http://localhost:3000
```

**See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed setup instructions.**

---

## 🎯 Features at a Glance

| Feature | Status |
|---------|--------|
| Real TMDB API Integration | ✅ Complete |
| Modern 5-Screen SPA | ✅ Complete |
| 4-Step Onboarding | ✅ Complete |
| Glassmorphism UI Design | ✅ Complete |
| Dark Mode (Auto + Manual) | ✅ Complete |
| Watchlist Management | ✅ Complete |
| Movie Search | ✅ Complete |
| Responsive Design | ✅ Complete (mobile-first) |
| Production Code Quality | ✅ Complete |

---

## 📂 Project Structure

```
FP/
├── backend/
│   ├── server.js          (Express with 9 TMDB endpoints)
│   ├── package.json       (Dependencies)
│   ├── .env              (Configuration - ADD YOUR API KEY HERE)
│   └── .env.example      (Template)
│
├── frontend/
│   ├── index.html         (5-screen SPA structure)
│   ├── css/
│   │   └── modern-styles.css  (800+ lines, production-grade)
│   └── js/
│       ├── app.js         (State + initialization)
│       ├── api.js         (Backend communication)
│       ├── movies.js      (Rendering)
│       └── screens.js     (Navigation)
│
└── DEPLOYMENT_GUIDE.md    (Full setup instructions)
```

---

## 📺 The 5 Screens

### 1️⃣ Welcome Screen
- CinemaFlow branding
- Welcome message
- "Get Started" CTA

### 2️⃣ Onboarding Screen (4-Step Wizard)
- **Step 1**: Language (EN, HI, TE, TA)
- **Step 2**: Age Rating (G, PG, PG-13, R)
- **Step 3**: Genres (Select 12 options)
- **Step 4**: Streaming Platforms (Select 6 options)

### 3️⃣ Main App Screen
- **Hero Banner**: Featured movie with trailer
- **Trending Now**: Top 10 trending movies
- **Recommended for You**: Based on preferences
- **Movie Cards**: Grid with hover effects
- **Search Bar**: Full-text movie search

### 4️⃣ Movie Details Modal
- Poster, title, metadata
- Overview, cast, directors
- Videos/trailers
- Similar movies
- Add to watchlist button

### 5️⃣ Search Results Modal
- Real-time search overlay
- Movie grid results
- Click to view details

**Bonus**: Watchlist sidebar (save & manage movies)

---

## 🔌 API Integration

All data comes from **TMDB API v3** (free tier):
- **Trending Movies**: Top 10 by popularity
- **Featured Movies**: Random for hero banner
- **Genre Movies**: 12+ genre categories
- **Search**: Real-time title search
- **Movie Details**: Full info with cast, videos, recommendations
- **User Preferences**: Filtered recommendations based on onboarding choices

---

## 🎨 Design Highlights

### Modern UI
- ✨ **Glassmorphism**: Soft shadows, backdrop blur effects
- 🌈 **Gradients**: Smooth color transitions
- ⚡ **Animations**: Smooth 150-300ms transitions
- 🌓 **Dark Mode**: Auto-detect system preference

### Mobile-First Responsive
- **Mobile**: 480px+
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Full**: Unlimited

### Accessibility
- Semantic HTML5
- ARIA labels
- Keyboard navigation
- Color contrast compliance

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| Backend | Node.js, Express.js |
| API | TMDB API v3 |
| HTTP | Fetch API, Axios |
| Storage | localStorage (client-side) |
| Styling | CSS Variables, Flexbox, Grid, @keyframes |

---

## 📊 Stats

- **JavaScript**: 4 modules, ~36KB, ~9KB each
- **CSS**: ~25KB (production-ready, dark mode)
- **HTML**: Single page with 5 nested screens
- **Backend**: Express server with 9 endpoints
- **API Calls**: 5 major endpoints + 2 utility endpoints
- **Production Ready**: ✅ Yes

---

## 🚀 Deployment Checklist

- [ ] Get TMDB API key (https://www.themoviedb.org/settings/api)
- [ ] Add API key to `backend/.env`
- [ ] Run `npm install` in backend folder
- [ ] Run `npm start` to start backend
- [ ] Open http://localhost:3000 in browser
- [ ] Complete onboarding flow
- [ ] Browse, search, and add movies to watchlist
- [ ] Test dark mode toggle
- [ ] Test on mobile (DevTools)

---

## 🎓 Code Quality

✅ **No Hardcoded Data** - Everything from TMDB API  
✅ **Comprehensive Error Handling** - Try/catch with user feedback  
✅ **Modular Architecture** - 4 independent JS modules  
✅ **State Management** - Centralized app object  
✅ **Performance** - Optimized for fast loading  
✅ **Accessibility** - WCAG-compliant markup  
✅ **Code Documentation** - Clear comments throughout  

---

## 📚 Documentation

- 📖 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Full setup & usage guide
- 🎬 [This file] - Quick reference
- 💾 [backend/.env.example](backend/.env.example) - Configuration template

---

## 🎯 Key Features Explained

### Multi-Step Onboarding
Users select preferences on 4 screens:
1. Preferred language (4 options)
2. Age rating comfort level (4 MPAA ratings)
3. Favorite movie genres (12 options, multi-select)
4. Streaming platforms they use (6 options, multi-select)

These preferences personalize their movie feed and recommendations.

### Real-Time Search
- Type any movie title
- Results appear instantly from TMDB
- Click any result to see full details
- Add to watchlist from search results

### Movie Details
View everything for any movie:
- Poster & backdrop images
- Title, release year, runtime
- Plot overview
- Star rating (out of 10)
- Cast and directors
- Available videos/trailers
- Similar movie recommendations

### Watchlist
- Click + button to save movies
- View all saved movies in sidebar
- Click to view details again
- Remove easily

### Dark Mode
- Automatic system preference detection
- Manual toggle with sun/moon icon
- Smooth theme transition
- Persistent across sessions

---

## 🎬 Movie Discovery Flow

```
Welcome Screen
     ↓
(Click "Get Started")
     ↓
Onboarding (4 steps)
     ↓
(Select: Language → Age → Genres → Platforms)
     ↓
Main App Screen
     ↓
(Browse hero → trending → recommended)
  ↓        ↓         ↓
Search  Details   Watchlist
```

---

## 💡 Pro Tips

1. **First Time?** Go through onboarding fully - it personalizes your experience
2. **Search Tips**: Use exact movie titles for best results
3. **Watchlist**: It saves locally - works offline (if data already loaded)
4. **Dark Mode**: Toggle anytime with the sun/moon button
5. **Trailers**: Click "Watch Trailer" in movie details for YouTube links
6. **Recommendations**: More accurate based on onboarding selections

---

## 🆘 Need Help?

### Backend won't start?
- Port 3000 might be in use → Edit .env to use PORT=3001
- Node/npm not installed → Install Node.js

### Movies not loading?
- Check API key is correct in backend/.env
- Verify backend is running on http://localhost:3000
- Check browser DevTools console for errors

### Dark mode issues?
- Browser localStorage might be disabled
- Check Settings → Privacy → Allow storage

**More troubleshooting in [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)**

---

## 🎉 Ready to Go!

This is a complete, production-ready movie discovery platform. Everything is implemented:
- ✅ Frontend (HTML, CSS, JavaScript)
- ✅ Backend (Express, TMDB API)
- ✅ UI/UX (Modern design, responsive)
- ✅ Features (Search, watchlist, details, dark mode)

**Just add your TMDB API key and you're ready to launch!**

---

**Version**: 1.0.0 (Production Ready)  
**Built with**: ❤️ for movie lovers  
**Last Updated**: 2024

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for complete setup instructions.
