import {defineConfig} from 'astro/config'
import purgecss from 'astro-purgecss'
import react from '@astrojs/react'
import unocss from 'unocss/astro'
import icons from 'astro-icon'
import compress from 'astro-compress'
import sitemap from '@astrojs/sitemap'
import config from './site.config'

// https://astro.build/config
export default defineConfig({
  site: config.site,
  devToolbar: {enabled: false},
  integrations: [
    sitemap(),
    icons(),
    react(),
    unocss({
      injectReset: true,
    }),
    purgecss({
      variables: true,
      keyframes: true,
      fontFace: true,
      safelist: {},
    }),
    compress({
      SVG: false,
      Image: false,
      CSS: false,
      JavaScript: false,
      HTML: true,
    }),
  ],
})
