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

## Deployment to Vercel

This project is configured for Vercel deployment.

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. For production:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Import your repository in [Vercel Dashboard](https://vercel.com/dashboard)
3. Vercel will automatically detect the configuration and deploy

### After Deployment

Your API will be available at:
- `https://your-project.vercel.app/api`

You can test it:
```bash
curl https://your-project.vercel.app/api
```

**Note:** The project uses Vercel's serverless functions structure. The API endpoint is in `api/index.js` and will be automatically deployed as a serverless function.

## Deployment to Netlify

This project is also configured for Netlify deployment.

### Option 1: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm i -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize and deploy:
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Option 2: Deploy via GitHub

1. Push your code to GitHub
2. Go to [Netlify Dashboard](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will automatically detect the `netlify.toml` configuration
6. Click "Deploy site"

### After Deployment

Your API will be available at:
- `https://your-project.netlify.app/api`
- Or your custom domain if configured

You can test it:
```bash
curl https://your-project.netlify.app/api
```

**Note:** The project uses Netlify's serverless functions structure. The API endpoint is in `netlify/functions/api.js` and will be automatically deployed as a serverless function. The `netlify.toml` file configures the redirect from `/api` to the function.

