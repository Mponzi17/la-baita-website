# La Baita Lounge website

Landing page for La Baita Lounge, Upper Hill Road, Nairobi: nyama choma, cocktails, live games, theme nights, car wash, catering and delivery.

Plain HTML, CSS and JavaScript. No build step, no framework, no package install.

## Run it locally

Open `index.html` in a browser, or serve the folder (needed for the scroll animations to behave exactly like production):

```bash
npx serve -l 8765 .
```

Then visit http://localhost:8765. An internet connection is needed for GSAP (loaded from cdnjs) and the Google map.

## Edit content

Everything that changes at launch lives in one file: [`assets/js/config.js`](assets/js/config.js)

- Booking / order / delivery / menu web-app links (`appUrls`, `menuCategoryUrl`)
- Phone, WhatsApp number and pre-filled WhatsApp messages
- Hours and address
- Bar shelf labels and brands
- Theme nights and events (poster images + text)
- Social tiles (Instagram posts)
- Header design on phones (`navStyle`: `"c"` is the chosen one)

Images live in `assets/img/` and can be replaced 1:1 with the restaurant's own photos using the same file names. Sources are listed in [`assets/CREDITS.md`](assets/CREDITS.md).

## Structure

```
index.html            the page
assets/css/main.css   all styles (design tokens at the top)
assets/js/config.js   content and links
assets/js/main.js     interactions and scroll animations (GSAP + ScrollTrigger)
assets/fonts/         self-hosted Big Shoulders Display, Outfit, Yellowtail
assets/img/           brand, menu, events, social, services, pour-video frames
assets/video/         hero video
Dockerfile, nginx.conf  container for Google Cloud Run or a VPS
```

## Deploy

Any static host works: upload the folder as-is.

For Cloud Run or a VPS with Docker:

```bash
docker build -t labaita .
docker run -d -p 80:8080 --restart unless-stopped labaita
```

When you change CSS or JS, bump the `?v=` number on their links in `index.html` so browsers fetch the new files (nginx caches `/assets` for a year).

## Testing tips

- `?reduce` forces the reduced-motion version, `?lite` the data-saver version.
- `?nav=a|b|c|d` previews the four phone header designs.
