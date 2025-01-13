export function ellipse(str: string, length: number) {
  return (str.length > length - 3 ? '...' : '') + str.slice(0, length - 3)
}
