# readyScout

readyScout is a disaster preparedness learning platform. The main web app uses Vite, React, and React Router, served in production by the Express/MongoDB API. The repository also contains a Flask Gemini chatbot and a separate Vite earthquake quiz.

## Run locally

Use Node.js and npm. Start MongoDB, then start the API and web app in separate terminals:

```bash
# Terminal 1: API and production static-file server
cd backend
npm install
cp .env.example .env
# Set MONGO_URI and JWT_SECRET in backend/.env
npm run dev
```

```bash
# Terminal 2: Vite development server
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:5173>. Vite proxies `/api` and `/uploads` to Express at port 5000. MongoDB must be running at the URI in `backend/.env`. Google sign-in also needs the Google OAuth client ID and secret, with the backend callback URL registered as `http://localhost:5000/api/auth/google/callback` and `FRONTEND_URL=http://localhost:5173`.

Nearby emergency places use the Geoapify Places API. Create a free API key at <https://myprojects.geoapify.com/> and set `GEOAPIFY_API_KEY` in `backend/.env` (and in the backend host's environment variables for deployment). Keep this key on the server; do not add it to the Vite frontend environment.

To run the chatbot, configure `flask/.env` with `GEMINI_API_KEY`, install its requirements, and start it separately:

```bash
cd flask
cp .env.example .env
python -m pip install -r requirements.txt
python app.py
```

The standalone quiz is independent:

```bash
cd earthquake-quiz
npm install
npm run dev
```

## Production deployment

The frontend is configured for a Vercel static deployment (`frontend/vercel.json`); select `frontend` as the Vercel project root. The rewrite sends `/api` and `/uploads` requests to the existing Express deployment and sends app routes to Vite's `index.html`. Update the Render hostname in that file if the API URL changes. On the Express host, run `npm install` and start with `npm start`. Configure `MONGO_URI`, `JWT_SECRET`, `SESSION_SECRET`, `GEOAPIFY_API_KEY`, and Google OAuth credentials there, and set `FRONTEND_URL` to the deployed Vercel origin. Set `VITE_FLASK_URL` in the Vercel build environment if the chatbot is hosted separately, and `GEMINI_API_KEY` on the Flask service. Express can also serve `frontend/dist` if you choose a single Node deployment instead.

## Tech stack

- Web app: Vite, React, React Router, Tailwind CSS
- API: Node.js, Express, MongoDB/Mongoose
- Authentication: JWT, bcryptjs, Passport and Google OAuth
- Chatbot: Flask and the Gemini `generateContent` API
- Nearby services: Geoapify Places (OpenStreetMap data)
- Alerts: USGS, GDACS and NDMA data
- Separate quiz: React, Vite and Framer Motion
