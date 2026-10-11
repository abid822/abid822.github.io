# abidur.net

Personal site for Abidur Chowdhury. Plain HTML, CSS, and vanilla JavaScript. No build step and no framework. The same files can be hosted on GitHub Pages or moved to Cloudflare later.

## Preview locally

Paths start with `/`, so open the site through a local server from this folder:

```bash
python3 -m http.server 8080
```

Then visit http://localhost:8080

## Add a game

1. Add one object to `js/projects.js`. `slug` becomes the folder name. Leave `stores.ios` or `stores.android` as `""` to show **Coming soon**, or set a full store URL.
2. Put a square icon in `images/` and point `icon` at it.
3. Copy `projects/bounceball/privacy.html` to `projects/<slug>/privacy.html`.
4. In the new privacy page, update the title, description, canonical URL, Open Graph URL, game name, the "Last updated" date, and the "On your device" section if that game stores something different.

The projects page links to `/projects/<slug>/privacy.html`. Keep that path once the App Store or Google Play points at it.

## Add photos

1. Put image files in `photos/` (jpg, png, webp, or svg).
2. Add one object to `js/photos.js` with `src`, `alt`, optional `caption`, and `width` / `height`.
3. Remove a picture by deleting its file in `photos/` and its entry in `js/photos.js`.

The gallery is a masonry layout. Click a photo for the lightbox. Arrow keys move between photos, Esc closes it.

## Deploy on GitHub Pages

Use a user site so the custom domain and the root-relative paths line up. The repository should be named `abid822.github.io` under the `abid822` account.

1. Push this folder to the `main` branch of `github.com/abid822/abid822.github.io`. The HTML files stay at the repository root.
2. On GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**. Branch: `main`. Folder: `/ (root)`.
3. Set the custom domain to `abidur.net`. The repo already contains a `CNAME` file with that domain. Turn on **Enforce HTTPS** after GitHub finishes the certificate.
4. `.nojekyll` is an empty file so GitHub copies every file as-is and does not run Jekyll.

`CNAME` is only for GitHub Pages. Cloudflare ignores it, so you can upload this same folder there without changing the pages.

## Squarespace DNS

In the Squarespace DNS settings for `abidur.net`, remove any other A, AAAA, or CNAME records on `@` and `www`. Then add:

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | abid822.github.io |

The four A records point the apex domain at GitHub Pages. The `www` CNAME points at the GitHub user site. After GitHub verifies the domain, `www.abidur.net` and `abidur.net` serve this site. DNS can take a while to update.
