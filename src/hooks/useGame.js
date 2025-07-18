// 自訂 Hook：管理 Tetris 遊戲邏輯與狀態
import { useState, useEffect, useRef } from 'react';
import TETROMINOS from '../utils/Tetrominos';
import BagSystem from '../utils/BagSystem';
import {
  createEmptyBoard,
  rotatePiece,
  isValidMove,
  placePiece,
  clearLines
} from '../utils/GameLogic';

export default function useGame() {
  // 遊戲板與方塊狀態
  const [board, setBoard] = useState(() => createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentX, setCurrentX] = useState(0);
  const [currentY, setCurrentY] = useState(0);

  // 分數、等級、清除列數
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);

  // 遊戲狀態：結束、暫停
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // 下一個與 Hold 系統
  const [nextPieces, setNextPieces] = useState([]);
  const [holdPiece, setHoldPiece] = useState(null);
  const [canHold, setCanHold] = useState(true);

  // 參考
  const bagSystemRef = useRef(new BagSystem());
  const gameLoopRef = useRef(null);
  const dropTimeRef = useRef(1000);

  // 初始化遊戲
  useEffect(() => {
    spawnPiece();
    updateNextPieces();
  }, []);
  

  // 遊戲主循環
  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(() => moveDown(), dropTimeRef.current);
    }
    return () => clearInterval(gameLoopRef.current);
  }, [currentPiece, currentX, currentY, board, gameOver, isPaused]);

  // 更新掉落速度
  useEffect(() => {
    dropTimeRef.current = Math.max(100, 1000 - (level - 1) * 100);
  }, [level]);

  // 產生新方塊
  const spawnPiece = () => {
    const type = bagSystemRef.current.getNext();
    const piece = TETROMINOS[type];
    const startX = Math.floor((10 - piece.shape[0].length) / 2);
    const startY = 0;
    // 無法放置即結束
    if (!isValidMove(board, piece.shape, startX, startY)) {
      setGameOver(true);
      return;
    }
    setCurrentPiece({ ...piece, type });
    setCurrentX(startX);
    setCurrentY(startY);
    setCanHold(true);
    updateNextPieces();
  };

  // 更新下一個顯示
  const updateNextPieces = () => {
    setNextPieces(bagSystemRef.current.peek(3));
  };

  // 方塊向下移動
  const moveDown = () => {
    if (!currentPiece) return;
    if (isValidMove(board, currentPiece.shape, currentX, currentY + 1)) {
      setCurrentY(y => y + 1);
    } else {
      lockPiece();
    }
  };

  // 固定方塊並清行
  const lockPiece = () => {
    if (!currentPiece) return;
    const newBoard = placePiece(board, currentPiece.shape, currentX, currentY, currentPiece.color);
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    setLines(l => l + linesCleared);
    setScore(s => s + linesCleared * 100 * level);
    setLevel(lv => Math.floor((lines + linesCleared) / 10) + 1);
    spawnPiece();
  };

  // 左移
  const moveLeft = () => {
    if (currentPiece && isValidMove(board, currentPiece.shape, currentX - 1, currentY)) {
      setCurrentX(x => x - 1);
    }
  };

  // 右移
  const moveRight = () => {
    if (currentPiece && isValidMove(board, currentPiece.shape, currentX + 1, currentY)) {
      setCurrentX(x => x + 1);
    }
  };

  // 旋轉方塊
  const rotate = () => {
    if (!currentPiece) return;
    const rotated = rotatePiece(currentPiece.shape);
    if (isValidMove(board, rotated, currentX, currentY)) {
      setCurrentPiece(p => ({ ...p, shape: rotated }));
    }
  };

  // 硬降
  const hardDrop = () => {
    if (!currentPiece) return;
    let newY = currentY;
    while (isValidMove(board, currentPiece.shape, currentX, newY + 1)) {
      newY++;
    }
    const newBoard = placePiece(board, currentPiece.shape, currentX, newY, currentPiece.color);
    const { board: clearedBoard, linesCleared } = clearLines(newBoard);
    setBoard(clearedBoard);
    setLines(l => l + linesCleared);
    setScore(s => s + linesCleared * 100 * level);
    setLevel(lv => Math.floor((lines + linesCleared) / 10) + 1);
    spawnPiece();
  };

  // Hold 功能
  const holdCurrentPiece = () => {
    if (!currentPiece || !canHold) return;
    if (holdPiece) {
      // 交換
      const temp = holdPiece;
      setCurrentPiece({ ...TETROMINOS[temp], type: temp });
      setHoldPiece(currentPiece.type);
      setCurrentX(Math.floor((10 - TETROMINOS[temp].shape[0].length) / 2));
      setCurrentY(0);
    } else {
      setHoldPiece(currentPiece.type);
      spawnPiece();
    }
    setCanHold(false);
  };

  // 重新開始
  const restartGame = () => {
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setCurrentX(0);
    setCurrentY(0);
    setScore(0);
    setLevel(1);
    setLines(0);
    setGameOver(false);
    setIsPaused(false);
    setNextPieces([]);
    setHoldPiece(null);
    setCanHold(true);
    bagSystemRef.current = new BagSystem();
    spawnPiece();
  };

  // 鍵盤監聽
  useEffect(() => {
    const handleKey = e => {
      if (gameOver) return;
      switch (e.key) {
        case 'ArrowLeft': e.preventDefault(); moveLeft(); break;
        case 'ArrowRight': e.preventDefault(); moveRight(); break;
        case 'ArrowDown': e.preventDefault(); moveDown(); break;
        case 'ArrowUp': e.preventDefault(); rotate(); break;
        case ' ': e.preventDefault(); hardDrop(); break;
        case 'c': case 'C': e.preventDefault(); holdCurrentPiece(); break;
        case 'p': case 'P': e.preventDefault(); setIsPaused(p => !p); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentPiece, currentX, currentY, board, gameOver, canHold]);

  return {
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
    canHold,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    holdCurrentPiece,
    restartGame
  };
}
