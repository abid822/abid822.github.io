# abidur.net

Personal site for Abidur Chowdhury.

## Add a photo

Drop the image file into the `photos` folder. That folder sits next to `index.html`. jpg, png, webp, and svg all work. Use a compressed jpg or webp for a picture from a camera or phone.

Then open `js/photos.js` and add one object to the `PHOTOS` list:

```js
{
  src: "/photos/filename.jpg",
  alt: "What the picture shows",
  caption: "Optional line under the photo",
  width: 1600,
  height: 1200,
},
```

- `src` starts with `/photos/` and matches the file name, including the extension.
- `alt` is required. Describe what is in the picture.
- `width` and `height` are the pixel size of the file. The gallery uses them so the layout does not jump while the image loads.
- `caption` is optional. Leave that line out if you do not want text under the picture.

Refresh the photography page and the new photo is in the gallery. To remove one, delete the file from `photos` and delete its object from `js/photos.js`.

Click a photo to open it. Arrow keys move between photos. Esc closes the viewer.

## Add game pictures

Open `js/projects.js`.

- `icon` is a square image, for example `/images/bounceball.png`. Put the file in `images`.
- `screenshots` is a list of up to 3 images. Each needs `src`, `alt`, `width`, and `height`. Put the files in `images` (a folder per game is fine) and point `src` at them. The card shows them in a small carousel. Tap a shot to open it larger.
- `media` is optional. Use it for a short gif or video, then leave it out when a game has no clip. `kind` is `"gif"` or `"video"`.

```js
screenshots: [
  { src: "/images/bounceball/shot-1.svg", alt: "Ball in the air", width: 360, height: 640 },
],
media: {
  kind: "video",
  src: "/images/bounceball/play.mp4",
  poster: "/images/bounceball/shot-1.svg",
  width: 360,
  height: 640,
  alt: "Short Bounce Ball clip",
},
```
