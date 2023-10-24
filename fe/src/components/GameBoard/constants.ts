import { DirectionType } from '@store/playerToken';

export const initialBoard = [
  [
    { logo: 'start', name: '시작' },
    { theme: 'it', logo: 'codesquad', name: '코드스쿼드', price: 400000 },
    { theme: 'fashion', logo: 'musinsa', name: '무신사', price: 500000 },
    { theme: 'trip', logo: 'hanatour', name: '하나투어', price: 600000 },
    { theme: 'construction', logo: 'gs', name: 'GS건설', price: 700000 },
    { theme: 'food', logo: 'nongshim', name: '농심', price: 800000 },
  ],
  [
    { logo: 'jail', name: '유치장' },
    {
      theme: 'construction',
      logo: 'hyundai',
      name: '현대건설',
      price: 900000,
    },
    {
      theme: 'military',
      logo: 'hanwha',
      name: '한화디펜스',
      price: 1000000,
    },
    { logo: 'goldcard', name: '황금카드' },
    { theme: 'trip', logo: 'koreanair', name: '대한항공', price: 1100000 },
    { theme: 'elonmusk', logo: 'twitter', name: '트위터', price: 1200000 },
  ],
  [
    { logo: 'goodnews', name: '호재' },
    {
      theme: 'pharmaceutical',
      logo: 'samsungbio',
      name: '삼성바이오로직스',
      price: 1300000,
    },
    { theme: 'it', logo: 'google', name: '구글', price: 1400000 },
    { logo: 'tax', name: '세금' },
    { theme: 'fashion', logo: 'hermes', name: '에르메스', price: 1500000 },
    { theme: 'food', logo: 'mcdonalds', name: '맥도날드', price: 1600000 },
  ],
  [
    { logo: 'rocket', name: '순간이동' },
    { theme: 'elonmusk', logo: 'tesla', name: '테슬라', price: 1700000 },
    {
      theme: 'pharmaceutical',
      logo: 'pfizer',
      name: '화이자',
      price: 1800000,
    },
    { logo: 'goldcard', name: '황금카드' },
    {
      theme: 'military',
      logo: 'starkindustry',
      name: '스타크산업',
      price: 1900000,
    },
    { theme: 'it', logo: 'apple', name: '애플', price: 2000000 },
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

export const TOKEN_TRANSITION_DELAY = 200;

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
