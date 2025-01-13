import {Suspense, useEffect, useRef, type RefObject} from 'react'
import {Canvas} from '@react-three/fiber'
import {Html, OrbitControls} from '@react-three/drei'
import {Physics} from '@react-three/rapier'
import {useFileDragAndDrop} from '../lib/useFileDragAndDrop'
import type {OrbitControls as THREEOrbitControls} from 'three-stdlib'
import {create} from 'zustand'
import {fetchBlobAndCache} from '../lib/fetchBlobAndCache'
import {getImageDataFromFile} from '../lib/getImageDataFromFile'
import VoxelImage from '../components/VoxelImage'
import {ellipse} from '../lib/ellipse'

const examples = [
  '/logos/chrome.png',
  '/logos/nix.png',
  '/logos/nextjs.png',
  '/logos/svelte.png',
  '/logos/bluesky.png',
]

type Store = {
  file?: File
  imageData?: ImageData
  example?: number
  loadFromFile: (file?: File) => Promise<void>
  loadFromNextExample: () => Promise<void>
}

export const useStore = create<Store>()((set, get) => ({
  loadFromFile: async (file) => {
    const imageData = file ? await getImageDataFromFile(file) : undefined
    set({file, imageData})
  },
  loadFromNextExample: async () => {
    const next = ((get().example ?? -1) + 1) % examples.length
    const filePath = examples[next]
    const blob = await fetchBlobAndCache(filePath)
    const file = new File([blob], filePath, {type: blob.type})
    const imageData = await getImageDataFromFile(file)
    set({file, imageData, example: next})
  },
}))

export default function VoxelIsh() {
  const orbitControlsRef = useRef<THREEOrbitControls>(null!)
  const loadImageFile = useStore((state) => state.loadFromFile)
  const {indicatorRef, eventHandlers} = useFileDragAndDrop({onFileDrop: loadImageFile})

  const file = useStore((state) => state.file)
  useEffect(() => {
    if (file && orbitControlsRef.current) {
      orbitControlsRef.current.reset()
    }
  }, [file])

  return (
    <div className="w-full h-full">
      <Canvas gl={{antialias: true}} camera={{position: [0, 5, 2]}} {...eventHandlers}>
        <OrbitControls
          ref={orbitControlsRef}
          autoRotate
          autoRotateSpeed={0.005}
          enableRotate={false}
          enablePan={false}
          enableZoom={false}
        />

        <directionalLight color="white" position={[-36, 2, -82]} intensity={15} />
        <directionalLight intensity={0.25} />
        <ambientLight intensity={0.25} />

        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            <Scene />
          </Physics>
        </Suspense>
        <HtmlPageContent />
      </Canvas>
      <div
        ref={indicatorRef as RefObject<HTMLDivElement>}
        className="hidden absolute -z-50 inset-5"
      >
        <div className="w-full h-full border-2 border-dashed border-gray-3a rounded-lg" />
      </div>
    </div>
  )
}

function Scene() {
  const imageData = useStore((store) => store.imageData)
  return imageData && <VoxelImage imageData={imageData} blockSize={0.25} />
}

function HtmlPageContent() {
  const fileInputRef = useRef<HTMLInputElement>(null!)
  const {file, example: exampleIndex, loadFromFile, loadFromNextExample} = useStore()

  useEffect(() => {
    loadFromNextExample()
  }, [loadFromNextExample])

  return (
    <Html fullscreen className="font-mono">
      <input
        ref={fileInputRef}
        type="file"
        id="file"
        name="file"
        accept="image/*"
        className="hidden"
        onInput={() => {
          const file = fileInputRef.current.files?.[0]
          if (file) loadFromFile(file)
        }}
      />

      <div className="p-5 sm:p-10 w-full h-[100svh] text-lg flex flex-col items-start justify-between select-none">
        <div className="w-full">
          <h1 className="text-4xl font-bold">VOXEL-ISH</h1>
          <p className="mt-1 text-gray-11">
            Inspired by <a href="https://nextjs.org/conf">Next.js Conf 2024</a>. Drag around.
          </p>
        </div>

        <div className="w-full flex flex-col lg:flex-row-reverse items-end justify-between">
          <div className="flex flex-row items-center justify-end">
            <div className="flex flex-col items-end">
              <div className="flex flex-row items-center gap-2">
                <div>{!file ? null : ellipse(file.name, 33)}</div>
                <div className="hidden sm:block">
                  {exampleIndex === undefined ? null : (
                    <button
                      type="button"
                      className="px-2 border border-gray-3a rounded text-gray-11"
                      onClick={() => loadFromNextExample()}
                    >
                      &gt;
                    </button>
                  )}
                </div>
              </div>
              {!file ? null : (
                <div className="text-gray-11">
                  {file.type} {Math.round(file.size / 1000)}kb
                </div>
              )}
            </div>
            <div className="sm:hidden block">
              {file && exampleIndex !== undefined ? (
                <button
                  type="button"
                  className="ml-5 px-4 py-2 border border-gray-3a rounded text-gray-11 text-2xl"
                  onClick={() => loadFromNextExample()}
                >
                  &gt;
                </button>
              ) : null}
            </div>
          </div>

          <div className="hidden lg:block max-w-prose">
            <p>
              Drag and drop images anywhere or <label htmlFor="file">upload</label>.
            </p>

            <p className="text-gray-11">
              Made with <a href="https://github.com/pmndrs/react-three-fiber">react-three-fiber</a>,{' '}
              <a href="https://github.com/pmndrs/react-three-rapier">react-three-rapier</a>, and{' '}
              <a href="https://github.com/pmndrs/use-gesture">use-gesture</a>.
            </p>
          </div>
        </div>
      </div>
    </Html>
  )
}
