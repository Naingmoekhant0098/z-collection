import * as React from "react"

export function useMediaQuery(query) {
  const [value, setValue] = React.useState(false)

  React.useLayoutEffect(() => {
    const handler = (e) => setValue(e.matches)
    const mediaQueryList = window.matchMedia(query)
    
    setValue(mediaQueryList.matches)
    mediaQueryList.addEventListener("change", handler)
    
    return () => mediaQueryList.removeEventListener("change", handler)
  }, [query])

  return value
}