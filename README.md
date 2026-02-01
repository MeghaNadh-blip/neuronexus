# Neuronexus — Frontend Prototype

This is a simple static frontend prototype for "Neuronexus" including:
- Landing page (index.html)
- Login page (login.html)
- Sign up page (signup.html)
- Dashboard (dashboard.html)
- Shared CSS (css/styles.css) and JS (js/app.js)

Features
- Responsive UI
- Accessible markup (labels, aria-live for errors)
- Client-side validation
- Mock authentication stored in localStorage for demo purposes (NOT secure; replace with real backend)

How to run
1. Clone or download the files to a folder.
2. Open `index.html` in your browser (double-click or use a local static server).
3. Sign up a new account at Sign Up, then you will be redirected to Dashboard.

Notes for production
- Remove localStorage auth and replace with secure API endpoints (HTTPS) and server-side sessions or JWTs.
- Use proper password hashing on the server (bcrypt/argon2).
- Add tests, form rate limiting, and strong CSRF/XSS protections.
- Consider using a framework (React/Vue) and a bundler for larger apps.

What I can do next
- Connect the frontend to a backend API (I can scaffold minimal Node/Express endpoints).
- Convert this into a React/Vite or Next.js project.
- Add UI components, routing, and state management.

If you want one of those next steps, tell me which and I’ll scaffold it.