#!/usr/bin/env powershell
# CinemaFlow Quick Setup Script

Write-Host "🎬 CinemaFlow - Premium Movie Discovery App" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get TMDB API Key
Write-Host "STEP 1: Get Your TMDB API Key" -ForegroundColor Yellow
Write-Host "-------------------------------"
Write-Host "1. Visit: https://www.themoviedb.org/settings/api"
Write-Host "2. Sign up for a FREE account (if not already registered)"
Write-Host "3. Copy your API Key (API v3)"
Write-Host "4. Keep it ready for the next step"
Write-Host ""

# Step 2: Setup Backend
Write-Host "STEP 2: Setup Backend Server" -ForegroundColor Yellow
Write-Host "-----------------------------"
cd backend
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
}

Write-Host ""
Write-Host "Enter your TMDB API Key when prompted:" -ForegroundColor Magenta
$apiKey = Read-Host "TMDB_API_KEY"

# Update .env file
$envContent = @"
TMDB_API_KEY=$apiKey
PORT=3000
NODE_ENV=development
"@

Set-Content -Path ".env" -Value $envContent
Write-Host "✅ API Key saved to backend/.env" -ForegroundColor Green

Write-Host ""
Write-Host "Starting backend server..." -ForegroundColor Cyan
Write-Host "Backend will run on http://localhost:3000" -ForegroundColor Cyan
npm start
