import {Center, OrbitControls, Text3D, useTexture} from '@react-three/drei'
import {Canvas, useFrame} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {Suspense, useRef} from 'react'
import * as THREE from 'three'
import type {OrbitControls as THREEOrbitControls} from 'three-stdlib'
import CanvasBoundOrthographicCamera from '../components/CanvasBoundOrthographicCamera'
import DraggableRigidBody from '../components/DraggableRigidBody'
import {sawatdee} from '../lib/thai'
import {easing} from 'maath'

const objectSize = 6
const padding = -1.5

export default function RapierText() {
  const orbitControlsRef = useRef<THREEOrbitControls>(null!)
  return (
    <Canvas shadows>
      <CanvasBoundOrthographicCamera position={[1, 0, 10]} zoom={60} />
      <OrbitControls
        ref={orbitControlsRef}
        autoRotate
        autoRotateSpeed={0.05}
        enableRotate={false}
        enablePan={false}
        enableZoom={false}
        dampingFactor={0.001}
      />
      <Suspense fallback={null}>
        <Physics gravity={[0, 0, 0]}>
          <Scene />
        </Physics>
      </Suspense>
    </Canvas>
  )
}

type TextBlocksProps = {
  texts: string[]
}
function TextBlocks({texts}: TextBlocksProps) {
  const moveback = ((objectSize + padding) * (texts.length - 1)) / 2
  const sizeStep = objectSize + padding
  const texture = useTexture('/textures/shiny.jpeg')

  return (
    <group>
      {texts.map((char, index) => (
        <DraggableRigidBody
          key={index}
          position={[index * sizeStep - moveback, (index % 2 === 0 ? objectSize / 1.4 : 0) - 1, 0]}
          rotation={new THREE.Euler(0, -0.5, 0.5)}
          linearDamping={2}
          angularDamping={2}
        >
          <Center>
            <Text3D
              font="/fonts/thai-sans.json"
              size={objectSize}
              height={3.4}
              smooth={0.2}
              letterSpacing={0}
              lineHeight={0}
            >
              {char}
              <meshMatcapMaterial matcap={texture} />
            </Text3D>
          </Center>
        </DraggableRigidBody>
      ))}
    </group>
  )
}

function Scene() {
  const groupRef = useRef<THREE.Group>(null!)
  useFrame((state, delta) => {
    const rotationFactor = Math.PI / 10
    easing.dampE(
      groupRef.current.rotation,
      [-state.pointer.y * rotationFactor, state.pointer.x * rotationFactor, 0],
      0.9,
      delta,
    )
  })

  return (
    <group ref={groupRef}>
      <TextBlocks texts={sawatdee.split(' ')} />
    </group>
  )
}
