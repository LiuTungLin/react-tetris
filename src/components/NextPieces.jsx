import "./NextPieces.css"
import PiecePreview from './PiecePreview'

const NextPieces = ({ next }) => (
  <div className="next-section">
    <h3>Next</h3>
    <div className="next-pieces">
      {next.map((t,i)=>
        <div key={i} className="next-piece">
          <PiecePreview type={t} />
        </div>
      )}
    </div>
  </div>
)

export default NextPieces