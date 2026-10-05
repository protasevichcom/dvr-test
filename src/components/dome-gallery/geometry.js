// @ts-check
import { screenToSphere, sphereToScreen } from './projection.js';

/**
 * Dome layout. The sphere around the head (`--dome-radius-m`; see projection.js) is a window onto an
 * infinite lattice of cells: rows line up (aligned grid) or alternate a half-column offset (hex grid,
 * `--dome-grid-offset`), and any resting position can be the center of the open cluster.
 *
 *  - Horizontally the window turns (yaw): a cell's column maps to yaw = column · columnStep, without
 *    wrapping, so a full turn reaches new content.
 *  - Vertically rows flow to the viewer (pitch is relative to the camera row): the gaze stays near
 *    eye level, which is more comfortable than looking up and down.
 *
 * Cells never overlap; a card's on-screen shape always comes from the sphere at its current position.
 */

const ASPECT = 9 / 16;
const DEG = Math.PI / 180;
const FIT_ITERATIONS = 4;
/** Points sampled along each screen edge when mapping the screen border onto the sphere. */
const CULL_EDGE_SAMPLES = 8;

/**
 * @typedef {object} DomeTokens
 * @property {number} radius              m; distance from the head to the cards
 * @property {number} cardWidth           m; physical poster width
 * @property {number} cardGap             m; horizontal gap between neighbouring posters
 * @property {number} rowGap              m; vertical gap between rows of open cards
 * @property {boolean} gridOffset         rows alternate a half-column offset (hex) or line up (rectangular)
 * @property {number} clusterColumns      cards in the inner rows of the open cluster (all rows but the first and last)
 * @property {number} clusterEdge         cards in its first and last rows (e.g. 3 + 5·3 + 3, 3/5/3, 2/3/2)
 * @property {number} clusterRows         rows of the open cluster (3, 4, 5…)
 * @property {number} clusterRowsAbove    of them, rows above the gaze row (the rest are below it)
 * @property {ClusterSize} [clusterFit]   size the view is fitted to, if not the cluster's own (it glides
 *                                        between cluster sizes during a display-mode switch)
 * @property {number} bannerSpan          cells a featured banner covers (2 on the hex grid, 3 on the aligned one)
 * @property {number} bannerColumns       columns between banner centers along a row
 * @property {number} bannerRows          rows between banner rows (even)
 * @property {number} clusterWidthShare   share of the viewport width the open cluster may use
 * @property {number} fov                 deg; horizontal field of view the viewport shows (virtual headset)
 * @property {number} infoHeight          px (resolved from rem); flat DOM info block under an open card
 * @property {number} referenceCardWidth  px (resolved from rem); poster width at which overlays render at full scale
 * @property {number} projectionStrength  s in r = tan(θ·s) / s
 * @property {number} safeTop             px from the top kept free (nav pill)
 * @property {number} safeBottom          px from the bottom kept free
 * @property {number} cullMargin          cells kept loaded beyond the screen edges (images arrive before cards scroll in)
 * @property {number} hoverScale          hovered posters grow by this factor (they may reach past the edge)
 * @property {number} parallaxDepth       px the gaze center moves with the pointer
 */

/**
 * Cluster size for fitting the view; may be fractional while it glides between two clusters.
 * @typedef {{ columns: number, edge: number, rows: number, above: number }} ClusterSize
 */

/**
 * @typedef {object} DomeLayout
 * @property {number} bannerColumns columns between banner centers along a banner row (lattice units)
 * @property {boolean} gridOffset   rows alternate a half-column offset
 * @property {number} clusterColumns cards in the inner rows of the open cluster
 * @property {number} clusterEdge    cards in its first and last rows
 * @property {number} clusterRows   rows of the open cluster
 * @property {number} clusterRowsAbove  of them, rows above the gaze row
 * @property {number} bannerSpan    cells a featured banner covers
 * @property {number} restShift     0 when the gaze rests on a card (odd middle), 0.5 between two cards (even)
 * @property {number} bannerRows    rows between banner rows (even)
 * @property {number} columnStep    rad of yaw per column
 * @property {number} rowStep       rad of pitch per row
 * @property {number} halfYaw       rad; half the poster width
 * @property {number} halfPitch     rad; half the poster height
 * @property {number} infoAngle     rad of pitch reserved for the info block
 * @property {number} activeShift   rad; how far the poster moves up when the card opens
 * @property {number} overlayScale  0…1; flat overlays (text, badges) shrink uniformly on small posters
 * @property {number} strength
 * @property {number} cullAngle     rad of yaw from the gaze within which cell centers are drawn
 * @property {number} cullPitchUp   rad of pitch above the gaze within which cell centers are drawn
 * @property {number} cullPitchDown rad of pitch below the gaze within which cell centers are drawn
 * @property {number} scale         screen px per projection unit (≈ px per radian at the gaze)
 * @property {{ x: number, y: number }} center  screen px of the gaze direction
 */

/**
 * A lattice position. `row` is an integer (positive = below); `column` is an integer on even rows
 * and a half-integer on odd rows. The camera rests on cells (2/3/2) or between two cells (3/4/3),
 * and moves between resting positions fractionally.
 * @typedef {{ row: number, column: number }} Cell
 */

/**
 * Physical model: posters of `cardWidth` metres on a sphere of `radius` metres around the head.
 * Angular sizes follow from the arc length (angle = length / radius); the ring holds as many
 * columns as fit its circumference. The viewport shows a virtual headset view of `fov` degrees;
 * if the open cluster would not fit between the nav pill and the bottom edge, the view zooms out.
 *
 * @param {DomeTokens} tokens
 * @param {{ width: number, height: number }} viewport
 * @returns {DomeLayout}
 */
export function computeLayout(tokens, viewport) {
  // Columns follow the card pitch directly, so the layout changes continuously with the card width
  // and the radius (the display-mode switch glides them). The lattice does not wrap.
  const columnStep = (tokens.cardWidth + tokens.cardGap) / tokens.radius;
  const halfYaw = tokens.cardWidth / tokens.radius / 2;
  const halfPitch = halfYaw * ASPECT;
  const rowGapAngle = tokens.rowGap / tokens.radius;
  const strength = tokens.projectionStrength;
  const availableHeight = viewport.height - tokens.safeTop - tokens.safeBottom;
  const fovScale = viewport.width / 2 / (Math.tan(((tokens.fov * DEG) / 2) * strength) / strength);
  const availableWidth = viewport.width * tokens.clusterWidthShare;
  const fit = tokens.clusterFit ?? {
    columns: tokens.clusterColumns,
    edge: tokens.clusterEdge,
    rows: tokens.clusterRows,
    above: tokens.clusterRowsAbove,
  };

  /** @type {DomeLayout} */
  const layout = {
    bannerColumns: tokens.bannerColumns,
    gridOffset: tokens.gridOffset,
    clusterColumns: tokens.clusterColumns,
    clusterEdge: tokens.clusterEdge,
    clusterRows: tokens.clusterRows,
    clusterRowsAbove: tokens.clusterRowsAbove,
    bannerSpan: tokens.bannerSpan,
    restShift: tokens.clusterColumns % 2 === 0 ? 0.5 : 0,
    bannerRows: tokens.bannerRows,
    columnStep,
    rowStep: 0,
    halfYaw,
    halfPitch,
    infoAngle: 0,
    activeShift: 0,
    overlayScale: 1,
    strength,
    cullAngle: 0,
    cullPitchUp: 0,
    cullPitchDown: 0,
    scale: fovScale,
    center: { x: viewport.width / 2, y: viewport.height / 2 },
  };

  // The info block is flat px, so its angular size depends on the scale; when the cluster has to
  // zoom out to fit, the scale changes again. A few fixed-point iterations converge.
  let bounds = { maxX: 1, minY: -1, maxY: 1 };
  for (let i = 0; i < FIT_ITERATIONS; i += 1) {
    layout.overlayScale = Math.min(1, (2 * halfYaw * layout.scale) / tokens.referenceCardWidth);
    layout.infoAngle = (tokens.infoHeight * layout.overlayScale) / layout.scale;
    layout.activeShift = layout.infoAngle / 2;
    layout.rowStep = 2 * halfPitch + layout.infoAngle + rowGapAngle;
    bounds = clusterBounds(layout, fit);
    layout.scale = Math.min(fovScale, availableHeight / (bounds.maxY - bounds.minY), availableWidth / (2 * bounds.maxX));
  }
  layout.center.y = tokens.safeTop + availableHeight / 2 - ((bounds.minY + bounds.maxY) / 2) * layout.scale;
  Object.assign(layout, screenCull(layout, tokens, viewport));
  return layout;
}

/**
 * Cull bounds from the actual screen: its border is mapped back onto the sphere (camera at rest),
 * then widened by what can reach past it — half a poster (grown by hover), the raised poster above
 * and its info block below an open card, the parallax shift — plus `cullMargin` cells loaded ahead.
 * @param {DomeLayout} layout  with its final scale and center
 * @param {DomeTokens} tokens
 * @param {{ width: number, height: number }} viewport
 */
function screenCull(layout, tokens, viewport) {
  const slack = tokens.parallaxDepth;
  const left = -layout.center.x - slack;
  const right = viewport.width - layout.center.x + slack;
  const top = -layout.center.y - slack;
  const bottom = viewport.height - layout.center.y + slack;
  let yaw = 0;
  let up = 0;
  let down = 0;
  for (let i = 0; i <= CULL_EDGE_SAMPLES; i += 1) {
    const t = i / CULL_EDGE_SAMPLES;
    const x = left + (right - left) * t;
    const y = top + (bottom - top) * t;
    for (const [px, py] of [[x, top], [x, bottom], [left, y], [right, y]]) {
      const point = screenToSphere(px / layout.scale, py / layout.scale, 0, layout.strength);
      yaw = Math.max(yaw, Math.abs(point.yaw));
      up = Math.max(up, -point.pitch);
      down = Math.max(down, point.pitch);
    }
  }
  const halfYaw = layout.halfYaw * tokens.hoverScale;
  const halfPitch = layout.halfPitch * tokens.hoverScale;
  return {
    cullAngle: yaw + halfYaw + tokens.cullMargin * layout.columnStep,
    cullPitchUp: up + halfPitch + layout.activeShift + tokens.cullMargin * layout.rowStep,
    cullPitchDown: down + halfPitch + layout.infoAngle + tokens.cullMargin * layout.rowStep,
  };
}

/**
 * Screen extent (projection units) of the open cluster, camera at rest. The size may be fractional
 * (a glide between two clusters), so the extreme rows and columns are sampled at fractional offsets.
 * @param {DomeLayout} layout
 * @param {ClusterSize} size
 */
function clusterBounds(layout, size) {
  const bounds = { maxX: 0, minY: Infinity, maxY: -Infinity };
  const above = size.above;
  const below = size.rows - 1 - size.above;
  const rowOffsets = [-above, below];
  for (let offset = Math.ceil(-above); offset <= Math.floor(below); offset += 1) rowOffsets.push(offset);
  for (const rowOffset of rowOffsets) {
    const edgeRow = size.rows > 1 && (rowOffset <= -above || rowOffset >= below);
    const halfCount = ((edgeRow ? size.edge : size.columns) - 1) / 2;
    for (const columnOffset of [-halfCount, 0, halfCount]) {
      const yaw = columnOffset * layout.columnStep;
      const pitch = rowOffset * layout.rowStep;
      for (const [y, p] of openOutline(layout, yaw, pitch, layout.halfYaw)) {
        const [u, v] = sphereToScreen(y, p, 0, layout.strength);
        bounds.maxX = Math.max(bounds.maxX, Math.abs(u));
        bounds.minY = Math.min(bounds.minY, v);
        bounds.maxY = Math.max(bounds.maxY, v);
      }
    }
  }
  return bounds;
}

/**
 * Sphere points along the outline of an open card: from the raised poster's top edge to the
 * bottom of the info block.
 * @param {DomeLayout} layout
 * @param {number} yaw       cell center
 * @param {number} pitch     cell center (relative to the camera row)
 * @param {number} halfYaw   half the poster width (wider for the banner)
 * @returns {[number, number][]}
 */
export function openOutline(layout, yaw, pitch, halfYaw) {
  const left = yaw - halfYaw;
  const right = yaw + halfYaw;
  const top = pitch - layout.activeShift - layout.halfPitch;
  const bottom = pitch + layout.halfPitch + layout.activeShift;
  /** @type {[number, number][]} */
  const points = [];
  for (let i = 0; i <= 4; i += 1) {
    const t = i / 4;
    const y = left + (right - left) * t;
    const p = top + (bottom - top) * t;
    points.push([y, top], [y, bottom], [left, p], [right, p]);
  }
  return points;
}

/**
 * Half-column offset of a row: odd rows on the hex grid, none on the aligned grid.
 * @param {number} row
 * @param {Pick<DomeLayout, 'gridOffset'>} layout
 */
export function rowOffset(row, layout) {
  return layout.gridOffset && Math.abs(Math.round(row)) % 2 === 1 ? 0.5 : 0;
}

/**
 * Rows between resting positions straight above each other: 2 on the hex grid (the next row with
 * the same column offset), 1 on the aligned grid.
 * @param {Pick<DomeLayout, 'gridOffset'>} layout
 */
export function rowStride(layout) {
  return layout.gridOffset ? 2 : 1;
}

/**
 * Column offset of resting positions on a row: on a cell for an odd middle count (2/3/2), between
 * two cells for an even one (3/4/3).
 * @param {number} row
 * @param {Pick<DomeLayout, 'restShift'>} layout
 */
export function restOffset(row, layout) {
  return (rowOffset(row, layout) + layout.restShift) % 1;
}

/**
 * Where the gaze rests at home: the featured banner (row −1) is the top row of the open cluster.
 * Odd middle counts rest on a card; even counts (3/4/3) rest between two cards, so the banner is
 * centered in the middle row instead.
 * @param {Pick<DomeLayout, 'restShift' | 'clusterRowsAbove'>} layout
 * @returns {Cell}
 */
export function homeRest(layout) {
  return layout.restShift ? { row: BANNER_ROW, column: 0 } : { row: BANNER_ROW + rowsAbove(layout), column: 0 };
}

/**
 * Rows of the open cluster above the gaze row.
 * @param {Pick<DomeLayout, 'clusterRowsAbove'>} layout
 */
export function rowsAbove(layout) {
  return layout.clusterRowsAbove;
}

/**
 * Rows of the open cluster below the gaze row.
 * @param {Pick<DomeLayout, 'clusterRows' | 'clusterRowsAbove'>} layout
 */
function rowsBelow(layout) {
  return layout.clusterRows - 1 - layout.clusterRowsAbove;
}

/**
 * Nearest resting position to a fractional camera position. On the hex grid only rows with the
 * same parity as `parityRow` qualify: vertical movement then goes straight up and down (two rows per
 * step land on the same column) and the cluster never jumps half a column sideways. On the aligned
 * grid every row qualifies.
 * Distances are measured in angles, so a row and a column weigh as they look.
 * @param {number} column
 * @param {number} row
 * @param {number} parityRow  any row of the parity to keep (usually the current center row)
 * @param {DomeLayout} layout
 * @returns {Cell}
 */
export function nearestCell(column, row, parityRow, layout) {
  const stride = rowStride(layout);
  const below = Math.floor(row);
  const parity = Math.abs(Math.round(parityRow)) % 2;
  const first = stride === 1 || Math.abs(below) % 2 === parity ? below : below - 1;
  /** @type {Cell} */
  let best = { row: first, column };
  let bestDistance = Infinity;
  for (const r of [first, first + stride]) {
    const offset = restOffset(r, layout);
    const c = Math.round(column - offset) + offset;
    const distance = Math.hypot((c - column) * layout.columnStep, (r - row) * layout.rowStep);
    if (distance < bestDistance) {
      best = { row: r, column: c };
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * Cards in a row of the open cluster: `clusterEdge` in the first and last rows, `clusterColumns` in
 * the inner ones (with a single row, that row is inner).
 * @param {number} offset  rows from the gaze row (negative = above)
 * @param {Pick<DomeLayout, 'clusterColumns' | 'clusterEdge' | 'clusterRows' | 'clusterRowsAbove'>} layout
 */
function clusterRowCount(offset, layout) {
  const edgeRow = layout.clusterRows > 1 && (offset === -rowsAbove(layout) || offset === rowsBelow(layout));
  return edgeRow ? layout.clusterEdge : layout.clusterColumns;
}

/**
 * 0 = in the open cluster around the resting position, 1 = next to it, 2 = periphery. The cluster is
 * `clusterRows` rows, `clusterRowsAbove` of them above the gaze row, each row centered on the gaze
 * column (3×3; 5×4 with the gaze on the second row; 3·5·5·5·3; 3/5/3…).
 * @param {Cell} cell
 * @param {Cell} rest
 * @param {Pick<DomeLayout, 'clusterColumns' | 'clusterEdge' | 'clusterRows' | 'clusterRowsAbove'>} layout
 * @returns {0 | 1 | 2}
 */
export function ringOf(cell, rest, layout) {
  const rel = Math.abs(cell.column - rest.column);
  const offset = cell.row - rest.row;
  const above = rowsAbove(layout);
  const below = rowsBelow(layout);
  if (offset >= -above && offset <= below && rel <= (clusterRowCount(offset, layout) - 1) / 2) return 0;
  const near = offset >= -above - 1 && offset <= below + 1;
  if (near && rel <= (Math.max(layout.clusterColumns, layout.clusterEdge) + 1) / 2) return 1;
  return 2;
}

/**
 * Cells inside the visible window around a (fractional) camera position.
 * @param {{ column: number, row: number }} camera
 * @param {DomeLayout} layout
 * @returns {Cell[]}
 */
export function cellsInView(camera, layout) {
  const columnSpan = Math.ceil(layout.cullAngle / layout.columnStep);
  const { first: firstRow, last: lastRow } = rowsInView(camera, layout);
  /** @type {Cell[]} */
  const cells = [];
  for (let row = firstRow; row <= lastRow; row += 1) {
    const offset = rowOffset(row, layout);
    const first = Math.floor(camera.column - columnSpan);
    for (let c = first; c <= Math.ceil(camera.column + columnSpan); c += 1) {
      cells.push({ row, column: c + offset });
    }
  }
  return cells;
}

/**
 * Range of rows that may hold cards in view (some may still fall outside `isInView`).
 * @param {{ column: number, row: number }} camera
 * @param {DomeLayout} layout
 */
export function rowsInView(camera, layout) {
  return {
    first: Math.floor(camera.row - layout.cullPitchUp / layout.rowStep),
    last: Math.ceil(camera.row + layout.cullPitchDown / layout.rowStep),
  };
}

/**
 * Whether a point (cell center) is close enough to the gaze to draw.
 * @param {number} column
 * @param {number} row
 * @param {{ column: number, row: number }} camera
 * @param {DomeLayout} layout
 */
export function isInView(column, row, camera, layout) {
  const pitch = (row - camera.row) * layout.rowStep;
  return (
    Math.abs(column - camera.column) * layout.columnStep <= layout.cullAngle &&
    pitch >= -layout.cullPitchUp &&
    pitch <= layout.cullPitchDown
  );
}

/**
 * Featured banners repeat on a fixed lattice: every `bannerColumns` columns along a banner row and
 * every `bannerRows` rows (even, so on the hex grid banners stay on offset rows). The spacing is in
 * lattice units, not angles, so it is the same in every display mode: a mode switch never turns a
 * card into a banner. The first banner row is just above eye level. A banner covers `bannerSpan` cells
 * centered on a whole column: 2 on the hex grid (center ± 0.5), 3 on the aligned grid (center ± 1).
 */
export const BANNER_ROW = -1;

/**
 * @param {number} row
 * @param {Pick<DomeLayout, 'bannerRows'>} layout
 */
export function isBannerRow(row, layout) {
  const period = layout.bannerRows;
  return (((row - BANNER_ROW) % period) + period) % period === 0;
}

/**
 * Banner centers within a column range on a banner row: every `bannerColumns` columns.
 * @param {number} from
 * @param {number} to
 * @param {DomeLayout} layout
 */
export function bannerColumnsBetween(from, to, layout) {
  const period = layout.bannerColumns;
  const columns = [];
  for (let k = Math.ceil(from / period); k * period <= to; k += 1) columns.push(k * period);
  return columns;
}

/**
 * The banner covering a cell, if any.
 * @param {Cell} cell
 * @param {DomeLayout} layout
 * @returns {number | null}  banner center column
 */
export function bannerAt(cell, layout) {
  if (!isBannerRow(cell.row, layout)) return null;
  const period = layout.bannerColumns;
  const center = Math.round(cell.column / period) * period;
  return Math.abs(cell.column - center) <= (layout.bannerSpan - 1) / 2 + 1e-9 ? center : null;
}

/**
 * Cells covered by a banner centered on `column`.
 * @param {number} row
 * @param {number} column
 * @param {Pick<DomeLayout, 'bannerSpan'>} layout
 * @returns {Cell[]}
 */
export function bannerCells(row, column, layout) {
  return Array.from({ length: layout.bannerSpan }, (_, i) => ({ row, column: column + i - (layout.bannerSpan - 1) / 2 }));
}
