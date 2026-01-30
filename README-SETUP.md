# How to View User Table on UI

## Step-by-Step Instructions

### Option 1: Using Two Terminals (Recommended)

1. **Open Terminal 1** - Start the Express API Server:
   ```bash
   cd "D:\User Data\Desktop\test versel api\demo-project"
   npm run dev:server
   ```
   You should see: `Server running on http://localhost:3000`

2. **Open Terminal 2** - Start the Vite Frontend:
   ```bash
   cd "D:\User Data\Desktop\test versel api\demo-project"
   npm run dev
   ```
   You should see: `Local: http://localhost:5173` (or similar port)

3. **Open your browser** and go to:
   ```
   http://localhost:5173
   ```

### What You'll See:

- **Cinema Seat Booking** component at the top
- **Users Table** component below it showing:
  - User ID
  - Email
  - Created At
  - Updated At
  - Refresh button

### Troubleshooting:

- If you see "Loading users..." - The API server might not be running
- If you see an error - Check that both servers are running
- Make sure your `.env` file has the correct `DATABASE_URL` and `DIRECT_URL`
