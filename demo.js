import { version } from './package.json';
import './app.css';
import { select, pointer } from 'd3-selection';
import { getVectorMagnitude, subtractPairs } from 'basic-2d-math';
import { lineRectHit } from './line-rect-hit';

var boardSel = select('#board');
var boxSel = select('#box');
var lineSel = select('#line');
var answerSel = select('#answer');

var boxRect = { left: 64, top: 128, right: 300, bottom: 250 };
var linePoints = { pt1: [540, 48], pt2: [100, 500] };
var dragging = false;
var onDragUpdaterFn;

(async function go() {
  window.addEventListener('error', reportTopLevelError);
  renderVersion();

  boardSel.on('mousedown', onBoardMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('mousemove', onMouseMove);

  renderBox(boxRect);
  renderLine(linePoints);
})();

function renderBox({ left, top, right, bottom }) {
  boxSel
    .attr('x', left)
    .attr('y', top)
    .attr('width', right - left)
    .attr('height', bottom - top);
}

function renderLine({ pt1, pt2 }) {
  lineSel
    .attr('x1', pt1[0])
    .attr('y1', pt1[1])
    .attr('x2', pt2[0])
    .attr('y2', pt2[1]);
}

function renderAnswer(isHitting) {
  answerSel.text(isHitting ? 'Yes' : 'No');
}

// Drag stuff
function onBoardMouseDown(e) {
  e.preventDefault();
  dragging = true;

  var point = pointer(e);
  const distTo1 = getDist(linePoints.pt1, point);
  const distTo2 = getDist(linePoints.pt2, point);
  const distToUpperLeft = getDist([boxRect.left, boxRect.top], point);
  const distToUpperRight = getDist([boxRect.right, boxRect.top], point);
  const distToLowerLeft = getDist([boxRect.left, boxRect.bottom], point);
  const distToLowerRight = getDist([boxRect.right, boxRect.bottom], point);

  const closestLineEndDist = Math.min(distTo1, distTo2);
  const closestBoxCornerDist = Math.min(
    distToUpperLeft,
    distToUpperRight,
    distToLowerLeft,
    distToLowerRight
  );

  if (closestLineEndDist < closestBoxCornerDist) {
    if (distTo1 < distTo2) {
      onDragUpdaterFn = (point) => (linePoints.pt1 = point);
    } else {
      onDragUpdaterFn = (point) => (linePoints.pt2 = point);
    }
  } else {
    if (closestBoxCornerDist === distToUpperLeft) {
      onDragUpdaterFn = (point) => {
        boxRect.left = point[0];
        boxRect.top = point[1];
      };
    } else if (closestBoxCornerDist === distToUpperRight) {
      onDragUpdaterFn = (point) => {
        boxRect.right = point[0];
        boxRect.top = point[1];
      };
    } else if (closestBoxCornerDist === distToLowerLeft) {
      onDragUpdaterFn = (point) => {
        boxRect.left = point[0];
        boxRect.bottom = point[1];
      };
    } else if (closestBoxCornerDist === distToLowerRight) {
      onDragUpdaterFn = (point) => {
        boxRect.right = point[0];
        boxRect.bottom = point[1];
      };
    }
  }
}

function onMouseUp() {
  dragging = false;
  onDragUpdaterFn = null;
}

function onMouseMove(e) {
  if (!dragging) {
    return;
  }

  if (onDragUpdaterFn) {
    onDragUpdaterFn([e.offsetX, e.offsetY]);
  }

  renderAnswer(lineRectHit({ line: linePoints, rect: boxRect }));
  renderLine(linePoints);
  renderBox(boxRect);
}

function getDist(ptA, ptB) {
  return getVectorMagnitude(subtractPairs(ptA, ptB));
}

function reportTopLevelError(event) {
  console.error('Top level error:', event.error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
