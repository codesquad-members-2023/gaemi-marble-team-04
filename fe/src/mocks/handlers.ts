// src/mocks/handlers.js
import { rest } from 'msw';
import { API_END_POINT } from '../api/constants';

export const handlers = [
  rest.post(API_END_POINT.SIGNUP, (_, res, ctx) => {
    return res(ctx.status(201));
  }),

  rest.post(API_END_POINT.SIGNIN, (_, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        playerId: 'antman',
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
          playerId: 'fuse12',
          userStatusBoard: {
            cashAsset: 0,
            stockAsset: 1000000,
            totalAsset: 1000000,
            stockList: [
              {
                id: 1,
                name: 'Google',
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
                id: 1,
                name: 'Google',
                quantity: 10,
                price: 50000,
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
];