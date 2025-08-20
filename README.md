# Portfolio

Modern, bottom-up timeline portfolio. Edit `data/entries.json` to add items — no HTML changes needed.

## Quick start

1. Open `data/entries.json` and update `name`, `tagline`, `links`, and `entries`.
2. Use a simple server to preview locally:
   - VS Code Live Server, or
   - `python -m http.server` (from this folder) then open `http://localhost:8000/`.

## Add a new entry

Append to `entries`:

```json
{
  "date": "2025-03-15",
  "title": "Built X",
  "description": "What you did.",
  "tags": ["tag1", "tag2"],
  "link": { "label": "Demo", "url": "https://..." }
}
```

Entries are auto-sorted by date. Newest appears at the bottom; click "Latest" to jump down.

## Deploy with your Namecheap domain

Option A: GitHub Pages (static hosting)
- Push this folder to a GitHub repo.
- In repo Settings → Pages, set Source to `main` → `/` (or `/docs`).
- Optional custom domain: add your domain in Pages → Custom domain. This creates a `CNAME` file.
- In Namecheap DNS, add a CNAME record from `www` → `your-username.github.io`. Add A records for apex if desired per GitHub docs.

Option B: Netlify or Vercel
- Drag-and-drop the folder or connect the repo. No build step needed.
- Set your custom domain in the host, then add the provided DNS records in Namecheap.

That’s it. Future updates are just edits to `data/entries.json`.

## Images

Place images in the `images/` folder.

In `data/entries.json`, add an `images` array to any entry:

```json
{
  "date": "2025-03-01",
  "title": "FIXXit Screenshots",
  "images": [
    "fixxit-home.png",
    { "src": "fixxit-listing.png", "alt": "Listings page", "caption": "Browse open jobs" }
  ]
}
```

Rules:
- If you pass just a filename, it resolves to `images/<filename>`.
- You can also provide `{ src, alt, caption, width, height }` objects.
- Images are shown as a responsive grid; clicking opens them in a new tab.


