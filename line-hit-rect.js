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
