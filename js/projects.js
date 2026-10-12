/**
 * Games shown on the projects page.
 *
 * To add a game:
 * 1. Copy an entry below and edit it.
 * 2. Put a square icon in /images and point `icon` at it.
 * 3. Copy projects/bounceball/privacy.html to projects/<slug>/privacy.html
 *    and update the game name, date, and anything the game stores.
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
    platforms: ["iOS", "Android"],
    stores: {
      ios: "",
      android: "",
    },
  },
];
