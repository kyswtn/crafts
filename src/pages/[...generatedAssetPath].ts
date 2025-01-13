import type {APIRoute} from 'astro'
import sharp from 'sharp'
import path from 'node:path'
import ico from 'sharp-ico'
import {getOGImage} from '../lib/og'
import OG from '../components/OG'

export function getStaticPaths() {
  return [
    {params: {generatedAssetPath: 'favicon.ico'}},
    {params: {generatedAssetPath: 'apple-touch-icon.png'}},
    {params: {generatedAssetPath: 'robots.txt'}},
    {params: {generatedAssetPath: 'og.png'}},
  ] as const
}
type GeneratedAssetPath = ReturnType<typeof getStaticPaths>[number]['params']['generatedAssetPath']

const iconsSrc = path.resolve('./public/icon.svg')
export const GET: APIRoute = async ({params, site}) => {
  const assetPath = params.generatedAssetPath as GeneratedAssetPath

  if (assetPath === 'apple-touch-icon.png') {
    const pngBuffer = await sharp(iconsSrc).resize(180).toFormat('png').toBuffer()
    return new Response(pngBuffer, {headers: {'Content-Type': 'image/png'}})
  }

  if (assetPath === 'favicon.ico') {
    const buffer = await sharp(iconsSrc).resize(32).toFormat('png').toBuffer()
    const icoBuffer = ico.encode([buffer])
    return new Response(icoBuffer, {headers: {'Content-Type': 'image/x-icon'}})
  }

  if (assetPath === 'robots.txt') {
    const sitemapURL = new URL('sitemap-index.xml', site)
    const robotsTxt = `
User-agent: *
Allow: /
Sitemap: ${sitemapURL.href}`.trim()
    return new Response(robotsTxt)
  }

  if (assetPath === 'og.png') {
    return getOGImage(OG)
  }

  throw new Error('unreachable')
}
