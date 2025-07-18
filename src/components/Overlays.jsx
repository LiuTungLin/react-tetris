import "./Overlays.css"

export function GameOver({ onRestart }) {
  return (
    <div className="game-over">
      <h2>Game Over!</h2>
      <button onClick={onRestart}>Restart</button>
    </div>
  )
}

export function Paused() {
  return (
    <div className="paused">
      <h2>Paused</h2>
      <p>Press P to resume</p>
    </div>
  )
}
