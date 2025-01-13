import {theme} from 'unocss/preset-wind'
import {presetWind, transformerDirectives, defineConfig} from 'unocss'
import {presetRadixColors} from 'unocss-preset-radix-colors'

type DefaultFontFamily = Record<'sans' | 'serif' | 'mono', string>
const systemFonts = theme.fontFamily as DefaultFontFamily
const fontFamily = {
  'system-sans': systemFonts.sans,
  'system-serif': systemFonts.serif,
  'system-mono': systemFonts.mono,
  sans: ['Geist', "'Geist Fallback'", systemFonts.sans].join(', '),
  serif: ["'Source Serif 4 Variable'", "'Source Serif 4 Fallback'", systemFonts.serif].join(', '),
  mono: ["'Monaspace Neon'", systemFonts.mono].join(', '),
}

export default defineConfig({
  theme: {
    fontFamily,
    letterSpacing: {
      serif: '-0.018em',
    },
    height: {
      svh: '100svh',
    },
  },
  shortcuts: {
    'font-serif': 'font-serif tracking-serif',
  },
  transformers: [transformerDirectives()],
  presets: [
    presetWind({dark: 'class'}),
    presetRadixColors({
      prefix: '',
      lightSelector: '.light',
      darkSelector: '.dark',
      colors: [
        // neutral
        'gray',
        // error
        'red',
        // success
        'green',
        // warning
        'yellow',
        //  info
        'blue',
      ],
    }),
  ],
})
