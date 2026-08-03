function makeGrid(cols, rows, marginAmount, tiles) {
  const margin = width * marginAmount;
  const cellW = (width - margin * 2) / cols;
  const cellH = (height - margin * 2) / rows;
  const tilePatterns = [
    [1, 1],
    [2, 2],
    [3, 2],
    [2, 3],
    [3, 3],
  ];

  let remainingSlots = cols * rows;
  let occupiedGrid = [];
  // init occupied grid
  for (let col = 0; col < cols; col++) {
    occupiedGrid[col] = [];
    for (let row = 0; row < rows; row++) {
      occupiedGrid[col][row] = false;
    }
  }

  while (remainingSlots > 0) {
    // pick a random tile pattern
    const patternId = Math.floor(Math.random() * tilePatterns.length);
    // get that w/h
    const [w, h] = tilePatterns[patternId];
    // pick a random start x and y in the grid (startCol, startRow)
    const startCol = Math.floor(Math.random() * (occupiedGrid.length - w + 1));
    const startRow = Math.floor(
      Math.random() * (occupiedGrid[0].length - h + 1),
    );

    let canPlace = true;
    // iterate through from those spots to see if can place
    for (let colOff = 0; colOff < w; colOff++) {
      for (let rowOff = 0; rowOff < h; rowOff++) {
        if (occupiedGrid[startCol + colOff][startRow + rowOff]) {
          canPlace = false;
          break;
        }
      }
    }

    if (!canPlace) continue; // go to top of loop

    // iterate through from x and y and set to true (startCol, startRow)
    for (let colOff = 0; colOff < w; colOff++) {
      for (let rowOff = 0; rowOff < h; rowOff++) {
        occupiedGrid[startCol + colOff][startRow + rowOff] = true;
      }
    }
    // create the parameters of the tile
    // push the tile to tiles
    const startX = margin + startCol * cellW;
    const startY = margin + startRow * cellH;
    tiles.push({
      x: startX + (w * cellW) / 2,
      y: startY + (h * cellH) / 2,
      w: w * cellW,
      h: h * cellH,
    });

    // slots are w and height so subtract from remainingSlots
    remainingSlots -= w * h;
  }
}
