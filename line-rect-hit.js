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
//
// Remember: In SVG, +y is down, so the bottom has the higher number than the top.
export function lineRectHit({ line, rect }) {
  if ([line.pt1, line.pt2].some(pointIsInsideRect)) {
    return true;
  }
  // If the leftmost point is to the right of the right side of the rect, they can't hit.
  if (Math.min(line.pt1[0], line.pt2[0]) > rect.right) {
    return false;
  }
  // If the rightmost point is to the left of the left side of the rect, they can't hit.
  if (Math.max(line.pt1[0], line.pt2[0]) < rect.left) {
    return false;
  }
  // If the topmost point is under the bottom side of the rect, they can't hit.
  if (Math.min(line.pt1[1], line.pt2[1]) > rect.bottom) {
    return false;
  }
  // If the bottommost point is above the side bottom of the rect, they can't hit.
  if (Math.max(line.pt1[1], line.pt2[1]) < rect.top) {
    return false;
  }

  const m = getSlope(line);
  const b = getIntercept(m, line.pt1[0], line.pt1[1]);

  if (isInBounds(calcLineY(m, rect.left, b), rect.top, rect.bottom)) {
    // The line hits the left side of the rect.
    return true;
  }
  if (isInBounds(calcLineY(m, rect.right, b), rect.top, rect.bottom)) {
    // The line hits the right side of the rect.
    return true;
  }

  // To check hits to the top and bottom, we rotate and pretend y is x and x is y.
  const rotatedM = 1 / m;
  const rotatedB = getIntercept(rotatedM, line.pt1[1], line.pt1[0]);

  if (
    isInBounds(calcLineY(rotatedM, rect.top, rotatedB), rect.left, rect.right)
  ) {
    // The line hits the top line of the rect.
    return true;
  }
  if (
    isInBounds(
      calcLineY(rotatedM, rect.bottom, rotatedB),
      rect.left,
      rect.right
    )
  ) {
    // The line hits the bottom line of the rect.
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
