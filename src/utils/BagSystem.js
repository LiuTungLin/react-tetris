// 袋子系統
class BagSystem {
  constructor() {
    this.bag = [];
    this.fillBag();
  }

  fillBag() {
    const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    this.bag = [...pieces].sort(() => Math.random() - 0.5);
  }

  getNext() {
    if (this.bag.length === 0) {
      this.fillBag();
    }
    return this.bag.pop();
  }

  peek(count = 1) {
    const result = [];
    const tempBag = [...this.bag];
    
    for (let i = 0; i < count; i++) {
      if (tempBag.length === 0) {
        const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
        tempBag.push(...pieces.sort(() => Math.random() - 0.5));
      }
      result.push(tempBag.pop());
    }
    
    return result;
  }
}

export default BagSystem;