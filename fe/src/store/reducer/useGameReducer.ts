import { useReducerAtom } from 'jotai/utils';
import {
  CellPayloadType,
  DicePayloadType,
  EndTurnPayloadType,
  EnterPayloadType,
  GameActionType,
  ReadyPayloadType,
  StartPayloadType,
  StatusBoardPayloadType,
  UserStatusPayloadType,
} from './type';
import { gameAtom } from '.';

export default function useGameReducer() {
  const [gameInfo, dispatch] = useReducerAtom(
    gameAtom,
    (
      prev,
      action: {
        type: keyof GameActionType;
        payload: GameActionType[keyof GameActionType];
      }
    ) => {
      switch (action.type) {
        case 'start': {
          const payload = action.payload as StartPayloadType;

          return {
            ...prev,
            game: {
              ...prev.game,
              currentPlayerId: payload.playerId,
              isPlaying: true,
            },
          };
        }

        case 'endTurn': {
          const payload = action.payload as EndTurnPayloadType;

          return {
            ...prev,
            game: {
              ...prev.game,
              currentPlayerId: payload.nextPlayerId,
              currentPlayerStatus: payload.nextPlayerStatus,
            },
          };
        }

        case 'dice': {
          const payload = action.payload as DicePayloadType;
          const { dice1, dice2 } = payload;
          console.log('dispatch dice');

          return {
            ...prev,
            game: {
              ...prev.game,
              dice: [dice1, dice2],
            },
          };
        }

        case 'enter': {
          return {
            ...prev,
            players: prev.players.map((player, index) => {
              const payload = action.payload as EnterPayloadType[];

              if (!payload[index]) {
                return player;
              }

              return {
                ...player,
                playerId: payload[index].playerId,
              };
            }),
          };
        }

        case 'ready': {
          return {
            ...prev,
            players: prev.players.map((player) => {
              const payload = action.payload as ReadyPayloadType;

              if (player.playerId !== payload.playerId) {
                return player;
              }

              return {
                ...player,
                isReady: payload.isReady,
              };
            }),
          };
        }

        case 'userStatusBoard': {
          return {
            ...prev,
            players: prev.players.map((player) => {
              const payload = action.payload as UserStatusPayloadType;

              if (player.playerId !== payload.playerId) {
                return player;
              }

              return {
                ...player,
                userStatusBoard: payload.userStatusBoard,
              };
            }),
          };
        }

        case 'cell': {
          return {
            ...prev,
            players: prev.players.map((player) => {
              const payload = action.payload as CellPayloadType;
              const { salary, dividend } = payload;
              const bonus = salary + dividend;

              const currentPlayer = prev.players.find(
                (player) => player.playerId === payload.playerId
              );
              const playerStocksName =
                currentPlayer?.userStatusBoard.stockList.map(
                  (stock) => stock.name
                );
              const playerStocks = prev.stocks.filter(
                (stock) => playerStocksName?.includes(stock.name)
              );
              const playerStockAsset = playerStocks.reduce((acc, cur) => {
                return acc + cur.price * cur.quantity;
              }, 0);

              if (player.playerId !== payload.playerId) {
                return player;
              }

              return {
                ...player,
                location: payload.location,
                userStatusBoard: {
                  ...player.userStatusBoard,
                  cashAsset: player.userStatusBoard.cashAsset + bonus,
                  stockAsset: playerStockAsset,
                  totalAsset:
                    player.userStatusBoard.cashAsset + playerStockAsset + bonus,
                },
              };
            }),
          };
        }

        case 'statusBoard': {
          const payload = action.payload as StatusBoardPayloadType;

          return {
            ...prev,
            stocks: prev.stocks.map((stock) => {
              const newStock = payload.stockStatusBoard.find(
                (resStock) => resStock.name === stock.name
              );

              if (!newStock) {
                return stock;
              }

              return {
                ...stock,
                quantity: newStock.quantity,
                price: newStock.price,
              };
            }),
          };
        }

        default: {
          return prev;
        }
      }
    }
  );

  return { gameInfo, dispatch };
}
