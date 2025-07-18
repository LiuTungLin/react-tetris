import "./GameInfo.css"

const GameInfo = ({ score, level, lines }) => (
  <div className="game-info">
    <div>Score: {score}</div>
    <div>Level: {level}</div>
    <div>Lines: {lines}</div>
  </div>
)

export default GameInfo
