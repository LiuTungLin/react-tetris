import "./HoldSection.css"
import PiecePreview from './PiecePreview'

const HoldSection = ({ hold }) => (
  <div className="hold-section">
    <h3>Hold (C)</h3>
    <div className="hold-area">
      <PiecePreview type={hold} size="medium" />
    </div>
  </div>
)

export default HoldSection
