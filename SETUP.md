# SETUP INSTRUCTIONS - QUICK REFERENCE

## Prerequisites
- Node.js >= 14.0.0 (Download from https://nodejs.org/)
- MongoDB (either local or Atlas cloud)

## Windows Quick Setup

### Step 1: Navigate to the project
```powershell
cd C:\Users\manik\OneDrive\Desktop\github\FP
```

### Step 2: Install dependencies
```powershell
cd backend
npm install
```

### Step 3: Start MongoDB (if using local)
- Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
- MongoDB runs on localhost:27017 by default

### Step 4: Seed the database
```powershell
npm run seed
```

### Step 5: Start the backend server
```powershell
npm start
```

Expected output:
```
Server running on http://localhost:5000
MongoDB Connected: localhost
```

### Step 6: Open the app
- Go to http://localhost:5000 in your browser
- Start by selecting a language!

## Using MongoDB Atlas (Cloud)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Get connection string from "Connect" button
4. Update backend/.env:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/movie-recommendations
   ```
5. Run: npm start

## Common Commands

```powershell
# Install dependencies
npm install

# Start server
npm start

# Start with auto-reload (development)
npm run dev

# Seed database with 512 movies
npm run seed
```

## Port Access
- Frontend: http://localhost:5000
- API: http://localhost:5000/api/movies

## Features to Test
1. ✅ Language selection - 4 languages
2. ✅ Age rating filter - 6 ratings
3. ✅ Genre selection - 4 genres  
4. ✅ OTT platform choice - 4 platforms
5. ✅ Movie recommendations displayed
6. ✅ Dark mode toggle (top-right)
7. ✅ Responsive on mobile/tablet
8. ✅ Smooth animations & transitions
9. ✅ Movie details in modals
10. ✅ Trailer links

## Troubleshooting

### Port 5000 already in use?
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB not found?
- Install from https://www.mongodb.com/try/download/community
- Set PATH environment variable
- Verify with: mongod --version

### Can't see movies?
- Run: npm run seed
- Check MongoDB is connected
- Check console for errors

## Next Steps
1. Customize movie database in backend/data/seedData.js
2. Modify gradient colors in frontend/css/styles.css
3. Update titles/descriptions in frontend/index.html
4. Deploy to Heroku, Vercel, or AWS

Happy coding! 🎬✨
