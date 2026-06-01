import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {

  return [
    {
      url: "https://abastoclub.com.mx",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

}