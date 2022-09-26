import React from 'react'
import { useDrag } from 'react-dnd'

function Piece({piece, typeletter, clickfunc, id}: {piece: string | undefined, typeletter: string, id: string, clickfunc: (data: string)=>void}) {
  const [{isDragging}, drag] = useDrag(() => (
    {
    type: "Piece",
    item : { id, piece }, 
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
      
    }),
  }))
  React.useEffect(() => {
      if (isDragging) {
        clickfunc(id)
      } 
  }, [isDragging])

  return (
    <div className="internal--piece" ref={drag}
        style={{
        transform: 'translate(0, 0)',   
        cursor: 'move',
      }}>{piece}</div>)
}

export { Piece }