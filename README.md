# Jack Bull — Portfolio Website

Personal portfolio for Jack Bull, UX Researcher & Applied AI Specialist.

## File Structure

```
portfolio-jack-bull/
├── index.html   — Single-page site (all sections)
├── style.css    — All styles, custom properties, responsive layout
├── script.js    — Scroll reveal, mobile nav, form intercept, active nav
└── README.md    — This file
```

No build step, no dependencies, no frameworks. Open `index.html` directly in a browser to preview locally.

---

## Deploy to GitHub Pages

1. **Create a new GitHub repository** (e.g. `jackbull-portfolio`).

2. **Push the folder contents** to the `main` branch:

   ```bash
   cd portfolio-jack-bull
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/jackbull-portfolio.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to the repository on GitHub
   - Settings → Pages
   - Source: **Deploy from a branch** → Branch: `main` / `/ (root)`
   - Click **Save**

4. Your site will be live at `https://YOUR_USERNAME.github.io/jackbull-portfolio/` within a minute or two.

---

## Deploy to Netlify (alternative)

1. Drag and drop the `portfolio-jack-bull` folder onto [netlify.com/drop](https://app.netlify.com/drop).
2. Netlify will assign a random URL instantly — you can rename it in site settings.

Or connect the GitHub repo for continuous deployment on every push.

---

## Customisation Notes

| What to change | Where |
|---|---|
| Accent colour | `--accent` in `:root` in `style.css` |
| Project case study links | `href="#"` on `.card-link` anchors in `index.html` |
| Bio / content copy | Section bodies in `index.html` |
| Contact form backend | Replace the `submit` handler in `script.js` with your preferred service (e.g. Formspree, Netlify Forms) |
