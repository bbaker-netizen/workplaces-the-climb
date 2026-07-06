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

## Editing

The source fragments this file is assembled from (mountain SVG generator,
reveal logic, styles, etc.) live in Google Drive / OneDrive under
`Marketing/The Climb/Build Source/`, along with a README on how to
regenerate `index.html` from those fragments. Edit there first, then copy
the regenerated file into this repo and push.
