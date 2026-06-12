
//the metadata route that generate a domain robot filr txt dinamically
export default function robots() {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] },
    ],
    sitemap: "https://yourdomain.com/sitemap.xml",
  };
}
