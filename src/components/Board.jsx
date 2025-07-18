import "./Board.css"

export default function Board({ board, current, x, y }) {
  const disp = board.map(row => [...row])
  if (current) {
    current.shape.forEach((r, py) =>
      r.forEach((c, px) => {
        if (c) {
          const X = x + px, Y = y + py
          if (Y>=0 && Y<20 && X>=0 && X<10) disp[Y][X] = current.color
        }
      })
    )
  }
  return (
    <div className="board-container">
      {disp.map((row,i) => (
        <div key={i} className="board-row">
          {row.map((cell,j)=>(
            <div
              key={j}
              className="board-cell"
              style={{ backgroundColor: cell||'#000' }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
