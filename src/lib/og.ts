import path from 'node:path'
import fs from 'node:fs/promises'
import {ImageResponse} from '@vercel/og'

export const getOGImage = async (Template: () => Promise<React.ReactElement>) => {
  const geist = await fs.readFile(path.resolve('./og-assets/Geist-Regular.ttf'))
  const geistExtraBold = await fs.readFile(path.resolve('./og-assets/Geist-ExtraBold.ttf'))
  const sourceSerif = await fs.readFile(path.resolve('./og-assets/SourceSerif4-400-Regular.ttf'))

  return new ImageResponse(await Template(), {
    width: 1200,
    height: 630,
    emoji: 'fluent',
    fonts: [
      {
        name: 'Geist',
        weight: 400,
        data: geist,
      },
      {
        name: 'Geist',
        weight: 800,
        data: geistExtraBold,
      },
      {
        name: 'Source Serif 4',
        data: sourceSerif,
      },
    ],
  })
}
