import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tupsicoana.com'
  const today = new Date()
  
  return [
    {
      url: baseUrl,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/sobre-mi`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/agendar-cita`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/contactame`,
      lastModified: today,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog/aprendamos-a-identificar-y-manejar-nuestras-emociones`,
      lastModified: new Date('2025-01-15'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/registro`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]
}
