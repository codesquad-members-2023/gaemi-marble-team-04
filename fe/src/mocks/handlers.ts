// src/mocks/handlers.js
import { rest } from 'msw';
import { API_END_POINT } from '../api/constants';

type PostSignInReqBody = {
  playerId: string;
};

export const handlers = [
  rest.post(API_END_POINT.SIGNUP, (_, res, ctx) => {
    return res(ctx.status(201));
  }),

  rest.post<PostSignInReqBody>(API_END_POINT.SIGNIN, (req, res, ctx) => {
    const playerId = req.body.playerId;

    return res(
      ctx.status(200),
      ctx.json({
        playerId,
      }),
      ctx.set({
        Authorization:
          'eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbklkIjoiZnVzZTEyIiwiZXhwIjoxNjk3NTk5MTM5fQ.LMkskjLUkPlUMbpzqmraYY3zQr0d5wQETGyecPbgdbpe7dsMVTOe6_kZMczTMfA2kE1NI9OycNvA4b_dlgK_jw',
        'Refresh-Token':
          'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2OTc2MDA5Mzl9.6sbeiPzyOM1G8nUJ_4UzdNBWTTUgwPJeQN3aPQmCDi83ncoMUf5JDRDaSIHN6yFf3sDwvkgO7U9-L6s9lGOq-Q',
      })
    );
  }),

  rest.post(API_END_POINT.LOGOUT, (_, res, ctx) => {
    return res(ctx.status(200));
  }),

  rest.post(API_END_POINT.GAMES, (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        gameId: 1,
      })
    );
  }),

  rest.get(`${API_END_POINT.GAMES}/1`, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        isPresent: true,
        isFull: false,
      })
    );
  }),

  rest.post('/enter', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'enter',
        data: [
          {
            order: 1,
            playerId: 'fuse12',
          },
          {
            order: 2,
            playerId: 'TOMMY',
          },
          {
            order: 3,
            playerId: 'MOVIE99',
          },
          {
            order: 4,
            playerId: 'toko123',
          },
        ],
      })
    );
  }),

  rest.post('/ready', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'ready',
        data: {
          playerId: 'fuse12',
          isReady: true,
        },
      })
    );
  }),

  rest.post('/buy', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'userStatusBoard',
        data: {
          playerId: 'TOMMY',
          userStatusBoard: {
            cashAsset: 0,
            stockAsset: 1000000,
            totalAsset: 1000000,
            stockList: [
              {
                name: 'google',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'starkindustry',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'codesquad',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'gs',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'hanwha',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'hyundai',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'koreanair',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'mcdonalds',
                quantity: 20,
                price: 50000,
              },
              {
                name: 'pfizer',
                quantity: 20,
                price: 50000,
              },
            ],
          },
        },
      })
    );
  }),

  rest.post('/sell', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'userStatusBoard',
        data: {
          playerId: 'fuse12',
          userStatusBoard: {
            cashAsset: 500000,
            stockAsset: 500000,
            totalAsset: 1000000,
            stockList: [
              {
                name: 'google',
                quantity: 10,
              },
            ],
          },
        },
      })
    );
  }),

  rest.get('/cell', (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        type: 'cell',
        data: {
          playerId: 'fuse12',
          location: 6,
          salary: 1000000,
          dividend: 1000000,
        },
      })
    );
  }),

  rest.post('/start', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'start',
        data: {
          playerId: 'fuse12',
        },
      })
    );
  }),

  rest.post('/endTurn', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'endTurn',
        data: {
          nextPlayerId: 'TOMMY',
          nextPlayerStatus: { type: 'default' },
        },
      })
    );
  }),

  rest.post('/dice', (_, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        type: 'dice',
        data: {
          startLocation: 0,
          dice1: 3,
          dice2: 5,
        },
      })
    );
  }),
];
