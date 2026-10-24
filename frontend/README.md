# readyScout web app

The frontend is a Vite + React single-page app. React Router handles client navigation. During development, Vite proxies `/api` and `/uploads` to the Express server on port 5000.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:5173>. Build static assets with `npm run build`; Express serves `dist/` in production. Set `VITE_FLASK_URL` before building if the chatbot is hosted at a non-local URL.
