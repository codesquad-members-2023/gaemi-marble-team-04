export const CELL = {
  WIDTH: 6,
  HEIGHT: 6,
};

export const CORNER_CELLS = [0, 6, 12, 18];

export const directions = {
  top: { x: 0, y: -CELL.HEIGHT },
  right: { x: CELL.WIDTH, y: 0 },
  bottom: { x: 0, y: CELL.HEIGHT },
  left: { x: -CELL.HEIGHT, y: 0 },
};

export const TOKEN_TRANSITION_DELAY = 200;
