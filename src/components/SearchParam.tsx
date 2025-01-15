import {useEffect, useState} from 'react'
import {useSearchParams} from '../lib/useSearchParams'

export default function SearchParam({name}: {name: string}) {
  const [value, setValue] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    setValue(searchParams[name])
  }, [name, searchParams])

  return <>{value ?? ''}</>
}
