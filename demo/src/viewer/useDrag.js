import { useRef, useState, useCallback, useEffect } from 'react';

function useDrag(onDrag, onEnd) {
  const [active, setActive] = useState(false)

  const down = useCallback(
    (e) => {
      // console.log('down')
      setActive(true)
      e.stopPropagation()
      e.target.setPointerCapture(e.pointerId)
    },
    [],
  )

  const up = useCallback(
    (e) => {
      // console.log('up')
      setActive(false)
      e.stopPropagation()
      e.target.releasePointerCapture(e.pointerId)
      if (onEnd) onEnd()
    },
    [onEnd],
  )

  const activeRef = useRef()
  useEffect(() => void (activeRef.current = active))
  const move = useCallback(
    (event) => {
      if (activeRef.current) {
        event.stopPropagation()
        onDrag(event.unprojectedPoint)
      }
    },
    [onDrag],
  )

  const [bind] = useState(() => ({ onPointerDown: down, onPointerUp: up, onPointerMove: move }))
  return [bind]
}

export default useDrag;