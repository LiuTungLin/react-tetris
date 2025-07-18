// 遊戲邏輯工具函數
const createEmptyBoard = () => {
  return Array(20).fill(null).map(() => Array(10).fill(0));
};

const rotatePiece = (piece) => {
  const rotated = piece[0].map((_, index) =>
    piece.map(row => row[index]).reverse()
  );
  return rotated;
};

const isValidMove = (board, piece, x, y) => {
  for (let py = 0; py < piece.length; py++) {
    for (let px = 0; px < piece[py].length; px++) {
      if (piece[py][px] !== 0) {
        const newX = x + px;
        const newY = y + py;
        
        if (newX < 0 || newX >= 10 || newY >= 20) {
          return false;
        }
        
        if (newY >= 0 && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
};

const placePiece = (board, piece, x, y, color) => {
  const newBoard = board.map(row => [...row]);
  
  for (let py = 0; py < piece.length; py++) {
    for (let px = 0; px < piece[py].length; px++) {
      if (piece[py][px] !== 0) {
        const newX = x + px;
        const newY = y + py;
        
        if (newY >= 0) {
          newBoard[newY][newX] = color;
        }
      }
    }
  }
  
  return newBoard;
};

const clearLines = (board) => {
  const newBoard = board.filter(row => row.some(cell => cell === 0));
  const linesCleared = 20 - newBoard.length;
  
  while (newBoard.length < 20) {
    newBoard.unshift(Array(10).fill(0));
  }
  
  return { board: newBoard, linesCleared };
};

export { createEmptyBoard, rotatePiece, isValidMove, placePiece, clearLines };