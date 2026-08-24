# Hostinger deployment

This app is a Node.js application. Create a Hostinger Node.js app for `zivai.cloud`, upload the project (including `server.js`), and set the startup file to `server.js`.

1. In Hostinger hPanel, create or identify the WordPress MySQL database and user. Grant that user access to the database.
2. Set the Node app environment variables from `.env.example` in hPanel. Use the exact database host, name, user, password, and a new private `ADMIN_PASSCODE`; do not commit a real `.env` file.
3. Upload the project, run `npm install --omit=dev`, then run `npm run build`.
4. Start/restart the Node app. On first start, the backend creates `wp_el_roi_songs`, `wp_el_roi_categories`, and `wp_el_roi_settings` in the existing WordPress database. It does not alter WordPress core tables.
5. Verify `https://zivai.cloud/api/health` returns `{ "ok": true, "database": "connected" }`. Then test public song loading, admin login, add/edit/delete song, categories, favorites/pins, and settings.

If Hostinger serves the React build from a separate document root, configure the Node app as the public app so `/api/*` and the SPA fallback are handled by `server.js`. The frontend uses same-origin `/api` by default.
