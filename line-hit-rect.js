// line format:
// {
//  pt1: [number, number];
//  pt2: [number, number];
// }
// rect format:
// {
//  left: number;
//  top: number;
//  right: number;
//  bottom: number;
// }
export function lineHitRect({ line, rect }) {
  if ([line.pt1, line.pt2].some(pointIsInsideRect)) {
    return true;
  }

  const m = getSlope(line);
  console.log('m', m);
  const b = getIntercept(m, line.pt1[0], line.pt1[1]);
  console.log('b', b);

  if (isInBounds(calcLineY(m, rect.left, b), rect.top, rect.bottom)) {
    // The line hits the left side of the rect.
    return true;
  }
  if (isInBounds(calcLineY(m, rect.right, b), rect.top, rect.bottom)) {
    // The line hits the right side of the rect.
    return true;
  }

  return false;

  function pointIsInsideRect(pt) {
    if (pt[0] < rect.left) {
      return false;
    }
    if (pt[0] > rect.right) {
      return false;
    }
    if (pt[1] < rect.top) {
      return false;
    }
    if (pt[1] > rect.bottom) {
      return false;
    }
    return true;
  }
}

function getSlope(line) {
  const dx = line.pt2[0] - line.pt1[0];
  const dy = line.pt2[1] - line.pt1[1];
  if (dx === 0) {
    return undefined;
  }
  return dy / dx;
}

function getIntercept(m, x, y) {
  return y - m * x;
}

function calcLineY(m, x, b) {
  return m * x + b;
}

function isInBounds(n, low, high) {
  return n >= low && n <= high;
}
