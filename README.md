# Portfolio Website

A modern, responsive portfolio website built with React, Vite, and TailwindCSS.

## Features

- Modern UI with animations using Framer Motion
- Responsive design using TailwindCSS
- Dynamic image galleries
- Admin panel for content management
- Protected routes with authentication
- Dark mode design

## Deployment Instructions

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

### Netlify Deployment

1. Push your code to a GitHub repository

2. Connect to Netlify:
   - Log in to Netlify
   - Click "New site from Git"
   - Choose your repository
   - Build settings are automatically configured via netlify.toml

3. Environment Variables:
   - Add your Firebase configuration in Netlify's environment variables
   - Required variables:
     - VITE_FIREBASE_API_KEY
     - VITE_FIREBASE_AUTH_DOMAIN
     - VITE_FIREBASE_PROJECT_ID
     - VITE_FIREBASE_STORAGE_BUCKET
     - VITE_FIREBASE_MESSAGING_SENDER_ID
     - VITE_FIREBASE_APP_ID

4. Deploy:
   - Netlify will automatically build and deploy your site
   - Any push to the main branch will trigger a new deployment

## Build Commands

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

## Tech Stack

- React
- Vite
- TailwindCSS
- Framer Motion
- Firebase
- React Router
