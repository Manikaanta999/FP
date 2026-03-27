# 🎬 MovieFlix - Getting Started Guide

## ✨ What You Have

A complete, production-ready movie recommendation web application with:

- ✅ 5-step guided filtering interface
- ✅ 512+ movies in MongoDB database
- ✅ Modern gradient UI with dark mode
- ✅ Fully responsive design
- ✅ Smooth animations and transitions
- ✅ Express.js backend API
- ✅ Clean, professional code

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js (download from https://nodejs.org/)
- MongoDB (local or cloud)

### Step 1: Install Node Dependencies

Open PowerShell/Terminal in the `backend` folder:

```powershell
cd backend
npm install
```

### Step 2: Start MongoDB

**Option 1 - Local MongoDB:**
```
mongod
```

**Option 2 - MongoDB Atlas Cloud:**
Edit `backend/.env` with your connection string:
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/movie-recommendations
```

### Step 3: Seed Database

```
npm run seed
```

You should see:
```
Successfully seeded 512 movies to the database!
```

### Step 4: Start Server

```
npm start
```

You should see:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

### Step 5: Open Browser

Go to: **http://localhost:5000**

✅ Done! Start selecting your preferences!

## 📋 Project Contents

### Files Created (20+)

**Backend:**
- `server.js` - Express application
- `config/db.js` - Database connection
- `models/Movie.js` - Movie data model
- `controllers/movieController.js` - Business logic
- `routes/movies.js` - API routes
- `data/seedData.js` - 512+ movie records
- `middleware/errorHandler.js` - Error handling
- `package.json` - Dependencies
- `.env` - Configuration

**Frontend:**
- `index.html` - 5 pages in one file
- `css/styles.css` - Gradients, animations, responsive
- `js/app.js` - Core logic
- `js/pages.js` - Navigation system
- `js/api.js` - Backend communication

**Documentation:**
- `README.md` - Full documentation
- `SETUP.md` - Setup instructions
- `PROJECT_CHECKLIST.md` - Feature verification
- `GETTING_STARTED.md` - This file

## 🎯 Using the Application

### User Journey

1. **Language** → Select Telugu, Hindi, English, or Others
2. **Age Rating** → Choose All, U/A, 13+, 16+, 18+, or A
3. **Genre** → Pick Action, Romance, Comedy, or Thriller/Crime
4. **OTT** → Select Hotstar, Netflix, Prime Video, or Others
5. **Results** → See 2+ recommended movies

### Features

- 🌙 **Dark Mode** - Toggle in top-right corner
- 📱 **Responsive** - Works on all devices
- ⚡ **Fast** - Instant movie recommendations
- 🎨 **Beautiful** - Gradient backgrounds with animations
- 🎬 **Trailers** - Watch movie trailers
- 📊 **Details** - See ratings and full information

## 🔧 Customization

### Add More Movies

Edit `backend/data/seedData.js`:

```javascript
{
  title: 'Your Movie',
  poster: 'url',
  plot: 'description',
  trailer: 'https://youtube.com/watch?v=id',
  detailsLink: 'https://imdb.com/title/id',
  language: 'Telugu',
  age: '13+',
  genre: 'Action',
  ott: 'Netflix',
  rating: 8.5,
  year: 2024
}
```

Then reseed:
```
npm run seed
```

### Change Colors

Edit `frontend/css/styles.css`:

```css
:root {
  --primary: #your-color;
  --secondary: #your-color;
  /* ... etc ... */
}
```

### Update Titles & Text

Edit `frontend/index.html`:

```html
<h1>Your Title Here</h1>
<p>Your description here</p>
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 in use | Change PORT in .env or kill process |
| MongoDB error | Install MongoDB or use Atlas |
| Can't see movies | Run `npm run seed` |
| Movies showing but no trailers | Update YouTube URLs in seedData.js |
| Dark mode not working | Check localStorage in DevTools |

## 💡 Tips

- Clear LocalStorage to reset selections: `localStorage.clear()` in DevTools console
- Use MongoDB Compass to view your database visually
- Test on mobile with DevTools device mode
- Use VSCode for easy code editing
- Deploy to Heroku or Vercel for free hosting

## 📚 Technology Stack

```
Frontend:        HTML5 + CSS3 + JavaScript (Vanilla)
Backend:         Node.js + Express.js
Database:        MongoDB + Mongoose
Styling:         CSS Gradients + Animations
State:           LocalStorage
API:             RESTful
```

## 🎓 Learning Resources Used

- MongoDB Documentation: https://docs.mongodb.com/
- Express.js Guide: https://expressjs.com/
- MDN Web Docs: https://developer.mozilla.org/
- CSS Gradients: https://developer.mozilla.org/en-US/docs/Web/CSS/gradient

## 🚀 Next Steps

### Immediate
1. ✅ Run the application
2. ✅ Test all 5 pages
3. ✅ Try dark mode
4. ✅ Check mobile view

### Short Term
5. Customize with your own movies
6. Change colors and branding
7. Update titles and descriptions
8. Add your own posters

### Long Term
9. Deploy to Heroku/Vercel
10. Add user authentication
11. Add reviews/ratings
12. Implement watchlist feature
13. Add social sharing

## 📧 Support

**Common Issues:**

Q: Server won't start?
A: Check if port 5000 is available and MongoDB is running

Q: No movies showing?
A: Run `npm run seed` to populate database

Q: Dark mode not persisting?
A: Check browser LocalStorage, may need to clear cache

Q: API calls failing?
A: Check browser console (F12) and server logs

## 📄 License

MIT - Free to use and modify

## ✨ Final Notes

This is a **production-ready** application that demonstrates:

- ✅ Full-stack development capability
- ✅ Modern UI/UX principles
- ✅ Database design and optimization
- ✅ RESTful API design
- ✅ Responsive web development
- ✅ Animation and interactivity

Perfect for portfolio showcase! 🎬

---

**Enjoy MovieFlix!** 🍿✨

Start the server and dive in!
