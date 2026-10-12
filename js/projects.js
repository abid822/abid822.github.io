/**
 * Games shown on the projects page.
 *
 * To add a game, copy an entry and edit it.
 * Put a square icon in /images and point `icon` at it.
 * Copy projects/bounceball/privacy.html to projects/<slug>/privacy.html
 * and update the game name, date, and anything the game stores.
 *
 * screenshots: up to 3 images. Extra entries are ignored.
 * Each one needs src, alt, width, and height.
 * Drop the files in /images, then point src at them, for example
 * /images/bounceball/shot-1.svg.
 *
 * media: optional short clip. Leave it off when there isn't one.
 * kind is "gif" or "video".
 *   media: {
 *     kind: "video",
 *     src: "/images/bounceball/play.mp4",
 *     poster: "/images/bounceball/shot-1.svg",
 *     width: 360,
 *     height: 640,
 *     alt: "Short Bounce Ball clip"
 *   }
 *
 * stores.ios / stores.android: a full https URL, or "" to show "Coming soon".
 * The privacy link is always /projects/<slug>/privacy.html.
 */
window.PROJECTS = [
  {
    slug: "bounceball",
    name: "Bounce Ball",
    description: "A portrait bouncing-ball arcade game.",
    icon: "/images/bounceball.png",
    screenshots: [
      {
        src: "/images/bounceball/shot-1.svg",
        alt: "Orange ball high between two green pillars",
        width: 360,
        height: 640,
      },
      {
        src: "/images/bounceball/shot-2.svg",
        alt: "Orange ball low over the sand, about to bounce",
        width: 360,
        height: 640,
      },
      {
        src: "/images/bounceball/shot-3.svg",
        alt: "Orange ball crossing toward the right pillar",
        width: 360,
        height: 640,
      },
    ],
    platforms: ["iOS", "Android"],
    stores: {
      ios: "",
      android: "",
    },
  },
];
