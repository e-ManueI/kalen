export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Care Connect",
  shortName: "CC",
  description: "Official Site: Care Connect System",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Login",
      href: "/auth/login",
    },
    {
      label: "Signup",
      href: "/auth/signup",
    },
  ],
  links: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com",
  },
  logo: {
    url: "/favicon.ico",
    alt: "CareConnect Logo",
  },
  communication: {
    address: "Bibi Titi & Morogoro Rd junction, Dar es Salaam, Tanzania",
    email: "admin@kalen.co.tz",
    phone: "+255 759 053 | +255 752 268",
    pobox: "P.O.Box 2958, Dsm, Tz",
    website: "kalen.co.tz",
  },
};
