import fs from 'node:fs/promises'
import {gray} from '@radix-ui/colors'

export default async function OG() {
  const iconSvg = await fs
    .readFile('./public/icon.svg', 'base64')
    .then((data) => `data:image/svg+xml;base64,${data}`)

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        color: '#000',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '56px',
        }}
      >
        <img
          src={iconSvg}
          alt="logo"
          style={{
            fontSize: '64px',
            width: '1em',
            height: '1em',
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '0 0 128px 0',
        }}
      >
        <div
          style={{
            padding: '0 56px 84px 56px',
            fontFamily: 'Geist',
            fontWeight: 800,
            fontSize: '84px',
          }}
        >
          Crafts
        </div>
        <div
          style={{
            width: '100%',
            height: '2px',
            background: gray.gray6,
          }}
        />
      </div>
    </div>
  )
}
