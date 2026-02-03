# Backend API

A Node.js backend API that fetches code from Google Drive and returns it.

## Installation

```bash
npm install
```

## Usage

### Start the server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### API Endpoint

**GET** `/api`

Fetches content from a Google Drive link and returns it.

**Default behavior:**
- Uses the hardcoded Google Drive link: `https://drive.google.com/file/d/16AaeeVhqj4Q6FlJIDMgdWASJvq7w00Yc/view?usp=sharing`

**With query parameter:**
- You can specify a different Google Drive URL via query parameter:
  ```
  GET /api?url=https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing
  ```

**Response format:**
```json
{
  "data": "content from Google Drive file"
}
```

**Example:**
```bash
curl http://localhost:3000/api
```

## Health Check

**GET** `/health`

Returns server status.

## Port

Default port is 3000. You can change it by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Deployment to Railway

1. Push your code to GitHub (if not already).
2. Go to [Railway](https://railway.app/) and sign in.
3. Click **New Project** → **Deploy from GitHub repo** and select this repository.
4. Railway will detect the Node.js app and use `npm start` (runs `node server.js`).
5. In your service, open **Settings** → **Networking** → **Generate Domain** to get a public URL.

Your API will be available at:
- `https://your-app.up.railway.app/api`
- `https://your-app.up.railway.app/health`

The app uses the `PORT` environment variable that Railway sets automatically.

## Deployment to Vercel

The project includes a Vercel serverless function in `api/index.js` so you can deploy to Vercel.

### Option 1: Vercel CLI

1. Install the CLI: `npm i -g vercel`
2. From the project root, run: `vercel`
3. For production: `vercel --prod`

### Option 2: GitHub

1. Push your code to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New** → **Project**.
3. Import your repository. Vercel will use `vercel.json` and deploy `api/index.js` as a serverless function.

Your API will be at `https://your-project.vercel.app/api`. The `/health` endpoint is only available when running the Express server (e.g. on Railway), not on Vercel.

