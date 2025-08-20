Put your images in this folder.

How to reference images from data/entries.json:
- Use just the filename (e.g. "fixxit-home.png") and it will resolve to images/fixxit-home.png
- Or use a full/absolute URL (https://...) or "/path" if hosted elsewhere

Example entry snippet:
{
  "date": "2025-03-01",
  "title": "FIXXit Screenshots",
  "images": [
    "fixxit-home.png",
    { "src": "fixxit-listing.png", "alt": "Listings page", "caption": "Browse open jobs" }
  ]
}

