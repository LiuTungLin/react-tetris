import "./PiecePreview.css"
import TETROMINOS from '../utils/Tetrominos'

export default function PiecePreview({ type, size='small' }) {
  if (!type) return null
  const { shape, color } = TETROMINOS[type]
  const S = size==='small' ? '15px' : '20px'
  return (
    <div className="piece-preview">
      {shape.map((r, i)=>(
        <div key={i} className="preview-row">
          {r.map((c,j)=>(
            <div
              key={j}
              className="preview-cell"
              style={{
                width: S, height: S,
                backgroundColor: c?color:'transparent',
                border: c?'1px solid #333':'none'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
