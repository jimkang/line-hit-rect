import { version } from './package.json';
import './app.css';
import { select, selectAll, pointer } from 'd3-selection';
import { getVectorMagnitude, subtractPairs } from 'basic-2d-math';

var drawingType = 'box';
var boardSel = select('#board');
var boxSel = select('#box');
var lineSel = select('#line');
var drawTypeGroupSel = selectAll('input[name="drawing-type"]');

var boxRect = { left: 64, top: 128, right: 300, bottom: 250 };
var linePoints = { pt1: [540, 48], pt2: [100, 500] };

(async function go() {
  window.addEventListener('error', reportTopLevelError);
  renderVersion();

  boardSel.on('click', onBoardClick);
  drawTypeGroupSel.on('change', onDrawingTypeGroupChange);

  renderBox(boxRect);
  renderLine(linePoints);
})();

function onBoardClick(e) {
  let point = pointer(e);
  if (drawingType === 'box') {
    adjustBoxByPoint(point);
  } else if (drawingType === 'line') {
    adjustLineByPoint(point);
  }
}

function onDrawingTypeGroupChange() {
  drawingType = this.value;
}

function adjustBoxByPoint(point) {
  var [x, y] = point;
  const distToLeft = Math.abs(boxRect.left - x);
  const distToRight = Math.abs(boxRect.right - x);
  if (distToLeft < distToRight) {
    boxRect.left = x;
  } else {
    boxRect.right = x;
  }
  const distToTop = Math.abs(boxRect.top - y);
  const distToBottom = Math.abs(boxRect.bottom - y);
  if (distToTop < distToBottom) {
    boxRect.top = y;
  } else {
    boxRect.bottom = y;
  }
  renderBox(boxRect);
}

function adjustLineByPoint(point) {
  const distTo1 = getVectorMagnitude(subtractPairs(linePoints.pt1, point));
  const distTo2 = getVectorMagnitude(subtractPairs(linePoints.pt2, point));

  if (distTo1 < distTo2) {
    linePoints.pt1 = point;
  } else {
    linePoints.pt2 = point;
  }

  renderLine(linePoints);
}

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

function reportTopLevelError(event) {
  console.error('Top level error:', event.error);
}

function renderVersion() {
  var versionInfo = document.getElementById('version-info');
  versionInfo.textContent = version;
}
