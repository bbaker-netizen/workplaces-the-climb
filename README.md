# The Climb — Live Pitch Tool

A single-page, self-contained sales pitch tool for The Business Builders by
Workplaces. A coach or prospect enters revenue, team size, industry, target
revenue and 4-Block scores; the tool plots the business onto its own peak in
the Seven Stages of Growth mountain range and generates a takeaway PDF.

Growth-stage research: the Seven Stages of Growth, The ReWild Group.
Applied under the CORA™ credential.

## Structure

Everything lives in `index.html` — a single self-contained file (HTML, CSS,
and JS all inline, no build step, no dependencies). This is the file Netlify
serves as-is.

The one exception is `netlify/functions/climb-ingest.js` — a small serverless
function (see "Sending to The Builder" below).

## Local preview

Just open `index.html` directly in a browser, or serve the folder with any
static file server, e.g.:

```
npx serve .
```

## Deploying

This repo is set up to deploy on Netlify as a static site (see
`netlify.toml` — publish directory is `.`, no build command needed).

To connect this repo to the existing Netlify site (`workplaces-the-climb`):

1. In the Netlify dashboard, open the **workplaces-the-climb** site.
2. Go to **Site configuration → Build & deploy → Continuous deployment**.
3. Click **Link repository** and select this GitHub repo.
4. Every push to `main` will then deploy automatically.

## Sending to The Builder

The Builder launches this app with `?prospect_id=...&company=...` appended to
the URL. The app reads those on load and holds onto them. When a prospect's
mountain is revealed, the app waits for the reveal animations to finish, then
quietly renders the reveal page to a PDF in the background (via html2pdf.js,
loaded in `<head>`) and sends it to that prospect's record in The Builder.
This happens automatically — it does not touch, depend on, or wait for the
visible "Save as PDF / print" button, which still uses `window.print()`
exactly as before. If there's no `prospect_id` in the URL (someone just opened
the site directly), the send is skipped entirely.

The browser never talks to The Builder directly. It POSTs to this site's own
`/.netlify/functions/climb-ingest` function, which holds the real ingest
secret server-side (as a Netlify environment variable) and forwards the
request to `https://builder.4workplaces.com/api/the-climb/ingest`. This
keeps the secret out of the public page source.

**Required Netlify environment variable** (Site configuration → Environment
variables, on the `workplaces-the-climb` site):

```
THE_CLIMB_INGEST_SECRET = <the Bearer token The Builder expects>
```

Without this variable set, the function returns a 500 and logs an error in
the Netlify function log — the visible pitch tool itself keeps working
normally either way.

## Editing

The source fragments this file is assembled from (mountain SVG generator,
reveal logic, styles, etc.) live in Google Drive / OneDrive under
`Marketing/The Climb/Build Source/`, along with a README on how to
regenerate `index.html` from those fragments. Edit there first, then copy
the regenerated file into this repo and push.
