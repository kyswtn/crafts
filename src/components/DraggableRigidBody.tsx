import {useThree, type GroupProps} from '@react-three/fiber'
import {
  RigidBody,
  useAfterPhysicsStep,
  type RapierRigidBody,
  type RigidBodyProps,
} from '@react-three/rapier'
import * as THREE from 'three'
import React, {type ReactElement} from 'react'
import {useRef} from 'react'
import {useGesture} from '@use-gesture/react'

const dragPlane = new THREE.Plane()
const cursorPosition2d = new THREE.Vector2()
const cursorPosition3d = new THREE.Vector3()
const zAxisNormal = new THREE.Vector3(0, 0, 1)
const tmpObject3dPosition = new THREE.Vector3()

type DraggableRigidBodyProps = {
  dragPlaneNormal?: THREE.Vector3
  children: React.ReactNode
} & Partial<RigidBodyProps>

export default function DraggableRigidBody(props: DraggableRigidBodyProps) {
  const {dragPlaneNormal = zAxisNormal, children, ...rigidBodyProps} = props

  const {size, raycaster, camera} = useThree()
  const activeDrag = useRef(false)
  const dragHandleRef = useRef<THREE.Group>(null!)
  const rigidBodyRef = useRef<RapierRigidBody>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  const bindGestures = useGesture(
    {
      onDragStart: ({intentional}) => {
        if (!intentional) return
        dragPlane.setFromNormalAndCoplanarPoint(dragPlaneNormal, dragHandleRef.current.position)

        activeDrag.current = true
        rigidBodyRef.current.setBodyType(2, true)
        document.body.style.cursor = 'grabbing'
      },
      onDrag: ({xy: [x, y]}) => {
        if (!activeDrag.current) return

        cursorPosition2d.set(x, y)
        raycaster.setFromCamera(cursorPosition2d, camera)
        raycaster.ray.intersectPlane(dragPlane, cursorPosition3d)

        dragHandleRef.current.position.set(...cursorPosition3d.toArray())
        dragHandleRef.current.getWorldPosition(tmpObject3dPosition)

        rigidBodyRef.current.wakeUp()
        rigidBodyRef.current.setNextKinematicTranslation(tmpObject3dPosition)
      },
      onDragEnd: () => {
        if (!activeDrag.current) return

        activeDrag.current = false
        rigidBodyRef.current.setBodyType(0, true)
        document.body.style.cursor = 'auto'
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: 1,
      },
      transform: (vec2) => {
        const [x, y] = vec2
        const normalX = ((x - size.left) / size.width) * 2 - 1
        const normalY = -((y - size.top) / size.height) * 2 + 1
        return [normalX, normalY]
      },
    },
  )

  useAfterPhysicsStep(() => {
    const matrix = meshRef.current.matrixWorld
    dragHandleRef.current.position.setFromMatrixPosition(matrix)
    dragHandleRef.current.setRotationFromMatrix(matrix)
  })

  return (
    <>
      <group
        ref={dragHandleRef}
        position={rigidBodyProps.position}
        visible={false}
        {...(bindGestures() as GroupProps)}
      >
        {React.cloneElement(children as unknown as ReactElement, {})}
      </group>
      <RigidBody position={rigidBodyProps.position} {...rigidBodyProps} ref={rigidBodyRef}>
        {React.cloneElement(children as unknown as ReactElement, {ref: meshRef})}
      </RigidBody>
    </>
  )
}
