import { VercelRequest, VercelResponse } from '@vercel/node'
import { ImageResponse } from '@vercel/og'
import got from 'got'

import { transformSVG } from './utils'

type AnyRecord = Record<string, any>

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-clearbit')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-logo-favicon')(),
  require('metascraper-title')()
])

const scrapeMetaData = async (targetUrl: string = 'https://sidespace.app') => {
  const { body: html, url } = await got(targetUrl)
  const metadata = await metascraper({ html, url })
  return metadata
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, mode, fromColor, viaColor, toColor, style } =
    req.query as AnyRecord

  try {
    require('url').parse(url)
  } catch (err) {
    res.status(400)
    res.json({ error: 'Invalid URL' })
    return
  }

  const metadata = await scrapeMetaData(url)

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 's-maxage=86400')

  const svgRaw = await transformSVG({
    url,
    mode,
    metadata,
    fromColor,
    viaColor,
    toColor,
    style
  })

  res.send(svgRaw)
}

// for dev
// ;(async () => {
//   const metadata = {
//     author: 'one-tab-group',
//     logo: 'https://logo.clearbit.com/github.com',
//     publisher: 'GitHub',
//     description:
//       'Easily scrape metadata from websites as a service using Vercel. & GitHub - one-tab-group/vercel-metafy: Easily scrape metadata from websites as a service using Vercel.',
//     image:
//       'https://opengraph.githubassets.com/741b8799a320724ae859087c853045d6c25ce563ccaf8526eb3f5f83ca156e5c/one-tab-group/vercel-metafy',
//     title:
//       'GitHub - one-tab-group/vercel-metafy: Easily scrape metadata from websites as a service using Vercel.'
//   }
//   // const res = await scrapeMetaData()
//   const res = await transformSVG({
//     mode: 'light',
//     metadata,
//     fromColor: 'f4a',
//     toColor: '4fa',
//     style: 'horizontal'
//   })
//   console.log(res)
// })()
