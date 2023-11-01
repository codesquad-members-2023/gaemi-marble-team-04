import { DirectionType } from '@store/reducer/type';

export const initialBoard = [
  [
    { logo: 'start', name: '시작' },
    { theme: 'it', logo: 'codesquad', name: '코드스쿼드' },
    { theme: 'fashion', logo: 'musinsa', name: '무신사' },
    { theme: 'trip', logo: 'hanatour', name: '하나투어' },
    { theme: 'construction', logo: 'gs', name: 'GS건설' },
    { theme: 'food', logo: 'nongshim', name: '농심' },
  ],
  [
    { logo: 'jail', name: '유치장' },
    {
      theme: 'construction',
      logo: 'hyundai',
      name: '현대건설',
    },
    {
      theme: 'military',
      logo: 'hanwha',
      name: '한화디펜스',
    },
    { logo: 'goldcard', name: '황금카드' },
    { theme: 'trip', logo: 'koreanair', name: '대한항공' },
    { theme: 'elonmusk', logo: 'twitter', name: '트위터' },
  ],
  [
    { logo: 'goodnews', name: '호재' },
    {
      theme: 'pharmaceutical',
      logo: 'samsungbio',
      name: '삼성바이오로직스',
    },
    { theme: 'it', logo: 'google', name: '구글' },
    { logo: 'tax', name: '세금' },
    { theme: 'fashion', logo: 'hermes', name: '에르메스' },
    { theme: 'food', logo: 'mcdonalds', name: '맥도날드' },
  ],
  [
    { logo: 'rocket', name: '순간이동' },
    { theme: 'elonmusk', logo: 'tesla', name: '테슬라' },
    {
      theme: 'pharmaceutical',
      logo: 'pfizer',
      name: '화이자',
    },
    { logo: 'goldcard', name: '황금카드' },
    {
      theme: 'military',
      logo: 'starkindustry',
      name: '스타크산업',
    },
    { theme: 'it', logo: 'apple', name: '애플' },
  ],
];

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

export const DICE_MOVE_DELAY = 200;
export const TELEPORT_MOVE_DELAY = 100;

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
