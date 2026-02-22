import { client } from '@/sanity/client'
import HomeClient from './HomeClient'

async function getUpdates() {
  return client.fetch(`
    *[_type == "siteUpdate"] | order(publishedAt desc) [0...8] {
      _id,
      title,
      publishedAt,
      category,
      pdfLinks
    }
  `)
}

export default async function Home() {
  const updates = await getUpdates()
  return <HomeClient updates={updates} />
}
