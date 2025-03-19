
# Career Finder App Setup Guide

This guide will help you set up the Career Finder application on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:
- Node.js (version 14 or higher)
- npm, yarn, or pnpm

## Setup Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd career-finder-app
   ```

2. **Install dependencies**

   Using npm:
   ```bash
   npm install
   ```

   Or using yarn:
   ```bash
   yarn install
   ```

   Or using pnpm:
   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   Or using yarn:
   ```bash
   yarn dev
   ```

   Or using pnpm:
   ```bash
   pnpm dev
   ```

4. **Open your browser**

   The application should now be running at http://localhost:5173 (or another port if 5173 is already in use)

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Main application pages
  - `/services` - Business logic and API services
  - `/utils` - Utility functions
  - `/data` - Static data files

## Adding New Users

The app currently uses localStorage for storing user data. In a production environment, you would replace this with a proper backend database.

## Data Sources

The application uses various datasets for:
- Career recommendations
- College information
- Student profiles

To modify these datasets, look for the relevant files in the `/src/data` directory.

## Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed correctly.
2. Check that you're using a compatible Node.js version.
3. Clear your browser cache and localStorage if you see unexpected behavior.
4. Check the console for any error messages.

## Project Deployment

To build for production:

```bash
npm run build
```

This will create a `dist` folder with optimized production files that can be deployed to any static hosting service.
