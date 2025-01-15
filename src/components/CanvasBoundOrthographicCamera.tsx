import {useMemo} from 'react'
import {useThree, type OrthographicCameraProps, type Vector3} from '@react-three/fiber'
import {OrthographicCamera} from '@react-three/drei'

export type Props = {
  zoom: number
  position: Vector3
  frustumCulled?: boolean
}

export default function CanvasBoundOrthographicCamera(props: Props) {
  const {zoom = 75, position = [0, 0, 0], frustumCulled = false} = props

  const {viewport} = useThree()
  const cameraArgs = useMemo<OrthographicCameraProps['args']>(() => {
    const frustumSize = 1
    const aspectRatio = viewport.width / viewport.height
    return [
      (frustumSize * aspectRatio) / -2,
      (frustumSize * aspectRatio) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.001,
      1000,
    ]
  }, [viewport])

  return (
    <OrthographicCamera
      makeDefault
      args={cameraArgs}
      zoom={zoom}
      position={position}
      frustumCulled={frustumCulled}
    />
  )
}
