# Deployment Guide - CredResolve

This guide explains how to deploy CredResolve to Render or similar platforms.

## Render Deployment

### Prerequisites

1. **MongoDB Database** - You'll need a MongoDB connection string
   - Use MongoDB Atlas (free tier available) or Render's MongoDB service
   - Get your connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### Environment Variables

Set these environment variables in your Render dashboard:

1. **MONGODB_URI** (Required)

   - Your MongoDB connection string
   - Example: `mongodb+srv://user:pass@cluster.mongodb.net/credresolve`

2. **PORT** (Optional)
   - Render automatically sets this, but you can override if needed
   - Default: 3000

### Render Configuration

1. **Build Command:** `npm install`

   - Render will automatically run this

2. **Start Command:** `npm start`

   - This runs `node src/app.js`

3. **Build Script:**
   - The `build` script in package.json is a placeholder (no build step needed for this Node.js app)
   - Render requires it, but it just echoes a message

### Steps to Deploy on Render

1. **Create a new Web Service** on Render
2. **Connect your repository** (GitHub, GitLab, etc.)
3. **Configure the service:**

   - **Build Command:** `npm install` (or leave blank, Render auto-detects)
   - **Start Command:** `npm start`
   - **Environment:** Node
   - **Node Version:** 18.x or 20.x (recommended)

4. **Add Environment Variables:**

   - Go to Environment tab
   - Add `MONGODB_URI` with your MongoDB connection string

5. **Deploy!**
   - Render will automatically build and deploy your app

### Health Check

Your app should be accessible at:

- Root: `https://your-app.onrender.com/`
- API: `https://your-app.onrender.com/api/...`

### Troubleshooting

**Build fails with "Missing script: build"**

- ✅ Fixed! The `build` script is now in package.json

**Application crashes on startup**

- Check that `MONGODB_URI` is set correctly
- Verify MongoDB connection string is valid
- Check Render logs for specific error messages

**Database connection errors**

- Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0) or add Render's IP
- Verify username/password in connection string
- Check if database name is correct

**Port errors**

- Render automatically sets `PORT` environment variable
- Your app uses `process.env.PORT || 3000`, which should work automatically

### Testing After Deployment

Once deployed, you can test your API:

```bash
# Test root endpoint
curl https://your-app.onrender.com/

# Test user creation
curl -X POST https://your-app.onrender.com/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

### Local Testing

To test locally before deploying:

1. Create a `.env` file:

   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   PORT=3000
   ```

2. Run the app:

   ```bash
   npm start
   ```

3. Test the API:
   ```bash
   npm run test:api
   ```

## Other Platforms

### Heroku

Similar setup:

- Add `MONGODB_URI` to config vars
- Heroku automatically sets `PORT`
- Use `npm start` as the start command

### Railway

- Add MongoDB service or use external MongoDB
- Set `MONGODB_URI` environment variable
- Railway auto-detects Node.js and runs `npm start`

### Vercel / Netlify

These platforms are better suited for serverless functions. For a full Express API, consider:

- Using Render, Railway, or Heroku
- Or refactoring to serverless functions
