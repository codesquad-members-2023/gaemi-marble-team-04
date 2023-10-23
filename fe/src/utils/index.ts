import { DirectionType } from '@store/playerToken';

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const changeDirection = (direction: DirectionType) => {
  switch (direction) {
    case 'top':
      return 'right';
    case 'right':
      return 'bottom';
    case 'bottom':
      return 'left';
    case 'left':
      return 'top';
    default:
      return 'top';
  }
};
