import './App.css';
import useGame from './hooks/useGame';
import Board from './components/Board';
import HoldSection from './components/HoldSection';
import NextPieces from './components/NextPieces';
import GameInfo from './components/GameInfo';
import Controls from './components/Controls';
import { GameOver, Paused } from './components/Overlays';

export default function App() {
  const {
    board,
    currentPiece,
    currentX,
    currentY,
    score,
    level,
    lines,
    gameOver,
    isPaused,
    nextPieces,
    holdPiece,
    restartGame
  } = useGame();

  return (
    <div className="tetris-game">
      <div className="game-container">
        {/* 左側 Hold */}
        <div className="left-panel">
          <HoldSection hold={holdPiece} />
        </div>

        {/* 中央 遊戲版 */}
        <div className="game-board">
          <Board board={board} current={currentPiece} x={currentX} y={currentY} />
          {gameOver && <GameOver onRestart={restartGame} />}
          {isPaused && <Paused />}
        </div>

        {/* 右側 資訊、預覽、操作說明 */}
        <div className="right-panel">
          <GameInfo score={score} level={level} lines={lines} />
          <NextPieces next={nextPieces} />
          <Controls />
        </div>
      </div>
    </div>
  );
}
