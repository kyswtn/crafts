import {Canvas, useThree, type Euler, type Vector3} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {Suspense, useEffect, useMemo} from 'react'
import * as THREE from 'three'
import CanvasBoundOrthographicCamera from '../components/CanvasBoundOrthographicCamera'
import DraggableInstancedRigidBodies from '../components/DraggableInstancedRigidBodies'
import CanvasBoundRigidWorldBox from '../components/CanvasBoundRigidWorldBox'
import {create} from 'zustand'
import {useSearchParams} from '../lib/useSearchParams'
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

const apiUrl = 'https://github-contributions-api.jogruber.de/v4'
type ResponseType = {
  total: {
    [year: string]: number
  }
  contributions: Array<{
    date: string
    count: number
    level: number
  }>
}

type Store = {
  username?: string
  data?: ResponseType
  setUsername: (username: string) => Promise<void>
}

export const useStore = create<Store>()((set) => ({
  setUsername: async (username) => {
    if (!username) return
    const response = await fetch(`${apiUrl}/${username}`)
    const data: ResponseType = await response.json()
    set({username, data})
  },
}))

export default function Contributions() {
  const {username, setUsername} = useStore()
  const searchParams = useSearchParams()

  useEffect(() => {
    ;(async () => {
      if (searchParams.by && searchParams.by !== username) {
        await setUsername(searchParams.by as string)
      }
    })()
  }, [searchParams, username, setUsername])

  return (
    <Canvas>
      <CanvasBoundOrthographicCamera position={[0, 0, 200]} zoom={75} />
      <Suspense fallback={null}>
        <Physics>
          <Scene />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

const tmpColor = new THREE.Color()
const palette = [
  '#ebedf0',
  '#9be9a8',
  '#40c463',
  '#30a14e',
  '#216e39',
  // Taken from GitHub as of 15/Jan/2024.
].map((c) => tmpColor.set(c).toArray())

function Scene() {
  const viewport = useThree((state) => state.viewport)
  const canvasSize = useThree((state) => state.size)
  const blockSize = useMemo(() => (canvasSize.width > 1024 ? 1 : 0.8), [canvasSize])

  const data = useStore((state) => state.data)
  const contributions = useMemo(() => {
    const contributions = (data?.contributions ?? []).filter((c) => c.level > 0).slice(0, 365)
    return contributions.map((c) => ({
      position: [
        Math.random() * (viewport.width / 1.5) - viewport.width / 2.5,
        Math.random() * 100 + viewport.height,
        Math.random() * 10,
      ] as Vector3,
      rotation: [Math.random() * 1, Math.random() * 2, Math.random() * 3] as Euler,
      color: palette[c.level ?? 0] as number[],
    }))
  }, [data, viewport])

  const colors = useMemo(
    () => new Float32Array(contributions.flatMap((c) => c.color)),
    [contributions],
  )
  const geometry = useMemo(() => {
    const geometry = new RoundedBoxGeometry(blockSize, blockSize, blockSize, 4, 0.04)
    geometry.setAttribute('color', new THREE.InstancedBufferAttribute(colors, 3))
    return geometry
  }, [blockSize, colors])

  const material = useMemo(
    () => new THREE.MeshPhysicalMaterial({vertexColors: true, transmission: 0.5}),
    [],
  )

  return (
    <group>
      <spotLight intensity={1} />
      <ambientLight intensity={2} />
      <directionalLight intensity={3} />
      <pointLight intensity={1} />
      <CanvasBoundRigidWorldBox />
      <DraggableInstancedRigidBodies
        bodies={contributions.map((c) => ({position: c.position, rotation: c.rotation}))}
        geometry={geometry}
        material={material}
      />
    </group>
  )
}
