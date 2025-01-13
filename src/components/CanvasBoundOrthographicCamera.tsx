import {useMemo} from 'react'
import {useThree, type OrthographicCameraProps, type Vector3} from '@react-three/fiber'
import {OrthographicCamera} from '@react-three/drei'

export type Props = {
  zoom: number
  position: Vector3
}

export default function CanvasBoundOrthographicCamera(props: Props) {
  const {viewport} = useThree()
  const cameraArgs = useMemo<OrthographicCameraProps['args']>(() => {
    const frustumSize = 1
    const aspectRatio = viewport.width / viewport.height
    return [
      (frustumSize * aspectRatio) / -2,
      (frustumSize * aspectRatio) / 2,
      frustumSize / 2,
      frustumSize / -2,
      0.01,
      1000,
    ]
  }, [viewport.width, viewport.height])

  return (
    <OrthographicCamera makeDefault args={cameraArgs} position={props.position} zoom={props.zoom} />
  )
}
