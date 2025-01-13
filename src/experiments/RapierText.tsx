import {Center, MeshTransmissionMaterial, Text3D} from '@react-three/drei'
import {Canvas, useLoader} from '@react-three/fiber'
import {Physics} from '@react-three/rapier'
import {Suspense} from 'react'
import * as THREE from 'three'
import {RGBELoader} from 'three-stdlib'
import CanvasBoundRigidWorldBox from '../components/CanvasBoundRigidWorldBox'
import DraggableRigidBody from '../components/DraggableRigidBody'
import {sawatdee} from '../lib/thai'
import CanvasBoundOrthographicCamera from '../components/CanvasBoundOrthographicCamera'

const objectSize = 5
const padding = -1.8

export default function RapierText() {
  return (
    <>
      <Canvas shadows>
        <Suspense fallback={null}>
          <Physics gravity={[0, 0, 0]}>
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  )
}

function SharedMaterial() {
  const texture = useLoader(RGBELoader, '/hdri/aerodynamics_workshop_1k.hdr')
  return (
    <MeshTransmissionMaterial
      background={texture}
      chromaticAberration={2}
      resolution={152}
      thickness={1.5}
      clearcoat={1}
      roughness={0.2}
      metalness={0.6}
    />
  )
}

type TextBlocksProps = {
  texts: string[]
}
function TextBlocks({texts}: TextBlocksProps) {
  const moveback = ((objectSize + padding) * (texts.length - 1)) / 2
  const sizeStep = objectSize + padding

  return (
    <group>
      {texts.map((char, index) => (
        <DraggableRigidBody
          key={index}
          position={[index * sizeStep - moveback, (index % 2 === 0 ? objectSize / 2 : 0) + 1, 0]}
          rotation={new THREE.Euler(0, 0.1, 0)}
          linearDamping={2}
          angularDamping={2}
        >
          <Center>
            <Text3D
              font="/fonts/thai.json"
              size={objectSize}
              height={1.25}
              smooth={0.05}
              letterSpacing={0}
              lineHeight={0}
            >
              {char}
              <SharedMaterial />
            </Text3D>
          </Center>
        </DraggableRigidBody>
      ))}

      <DraggableRigidBody
        scale={1.25}
        rotation={new THREE.Euler(0, 0.1, 0)}
        linearDamping={2}
        angularDamping={2}
      >
        <mesh>
          <boxGeometry />
          <SharedMaterial />
        </mesh>
      </DraggableRigidBody>
    </group>
  )
}

function Scene() {
  return (
    <group>
      <directionalLight intensity={1} />
      <ambientLight intensity={1} />
      <CanvasBoundRigidWorldBox />
      <CanvasBoundOrthographicCamera position={[1, 2, 20]} zoom={65} />
      <TextBlocks texts={sawatdee.split(' ')} />
    </group>
  )
}
