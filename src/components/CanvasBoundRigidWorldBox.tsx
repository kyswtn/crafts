import {useThree} from '@react-three/fiber'
import {
  useFixedJoint,
  RigidBody,
  type FixedJointParams,
  type RapierRigidBody,
} from '@react-three/rapier'
import * as THREE from 'three'
import {useMemo, useRef} from 'react'

export const fixedJointParams = [
  [0, 0, 0],
  [0, 0, 0, 1],
  [0, 0, 0],
  [0, 0, 0, 1],
] as FixedJointParams

export default function CanvasBoundRigidWorldBox() {
  const refs = {
    bottom: useRef<RapierRigidBody>(null!),
    left: useRef<RapierRigidBody>(null!),
    right: useRef<RapierRigidBody>(null!),
    back: useRef<RapierRigidBody>(null!),
    front: useRef<RapierRigidBody>(null!),
  }
  useFixedJoint(refs.bottom, refs.left, fixedJointParams)
  useFixedJoint(refs.bottom, refs.right, fixedJointParams)
  useFixedJoint(refs.bottom, refs.back, fixedJointParams)
  useFixedJoint(refs.bottom, refs.front, fixedJointParams)

  type Configuration = {
    name: keyof typeof refs
    position: [number, number, number]
    args: [number, number, number]
  }
  const {viewport} = useThree()
  const configurations = useMemo(
    () =>
      [
        {
          name: 'bottom',
          position: [0, -viewport.height / 2, 0],
          args: [viewport.width, 0.01, viewport.height * 2],
        },
        {
          name: 'left',
          position: [-viewport.width / 2, 0, 0],
          args: [0.01, viewport.height, viewport.height * 2],
        },
        {
          name: 'right',
          position: [viewport.width / 2, 0, 0],
          args: [0.01, viewport.height, viewport.height * 2],
        },
        {
          name: 'back',
          position: [0, 0, -viewport.height],
          args: [viewport.width, viewport.height, 0.01],
        },
        {
          name: 'front',
          position: [0, 0, viewport.height],
          args: [viewport.width, viewport.height, 0.01],
        },
      ] as Configuration[],
    [viewport],
  )

  const sharedMaterial = useMemo(() => {
    const material = new THREE.MeshBasicMaterial({visible: false})
    return material
  }, [])

  return (
    <group>
      {configurations.map(({name, position, args}) => {
        return (
          <RigidBody key={name} ref={refs[name]} type="fixed" position={position}>
            <mesh material={sharedMaterial}>
              <boxGeometry args={args} />
            </mesh>
          </RigidBody>
        )
      })}
    </group>
  )
}
