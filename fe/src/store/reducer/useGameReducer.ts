import { useReducerAtom } from 'jotai/utils';
import {
  CellPayloadType,
  DicePayloadType,
  EndTurnPayloadType,
  EnterPayloadType,
  EventResultPayloadType,
  EventsPayloadType,
  ExpensePayloadType,
  GameActionType,
  PrisonDicePayloadType,
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
              firstPlayerId: payload.playerId,
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
              isMoveFinished: false,
            },
          };
        }

        case 'dice': {
          const payload = action.payload as DicePayloadType;
          const { dice1, dice2 } = payload;

          return {
            ...prev,
            game: {
              ...prev.game,
              dice: [dice1, dice2],
              isMoveFinished: true,
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
                isReady: payload[index].isReady,
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

              if (player.playerId !== payload.playerId) {
                return player;
              }

              return {
                ...player,
                location: payload.location,
                userStatusBoard: {
                  ...player.userStatusBoard,
                  cashAsset: player.userStatusBoard.cashAsset + bonus,
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

        case 'events': {
          const payload = action.payload as EventsPayloadType;

          return {
            ...prev,
            game: {
              ...prev.game,
              eventList: [...payload.events],
            },
          };
        }

        case 'eventResult': {
          const payload = action.payload as EventResultPayloadType;

          return {
            ...prev,
            game: {
              ...prev.game,
              eventResult: payload.name,
            },
          };
        }

        case 'expense': {
          const payload = action.payload as ExpensePayloadType;

          return {
            ...prev,
            players: prev.players.map((player) => {
              if (player.playerId !== payload.playerId) {
                return player;
              }

              return {
                ...player,
                userStatusBoard: {
                  ...player.userStatusBoard,
                  cashAsset: player.userStatusBoard.cashAsset - payload.amount,
                },
              };
            }),
          };
        }

        case 'prisonDice': {
          const payload = action.payload as PrisonDicePayloadType;
          const { dice1, dice2 } = payload;

          if (!payload.hasEscaped) {
            return {
              ...prev,
              game: {
                ...prev.game,
                dice: [dice1, dice2],
              },
              players: prev.players.map((player) => {
                if (player.playerId !== payload.playerId) {
                  return player;
                }
                return {
                  ...player,
                  gameboard: {
                    ...player.gameboard,
                    hasEscaped: false,
                  },
                };
              }),
            };
          }

          return {
            ...prev,
            game: {
              ...prev.game,
              dice: [dice1, dice2],
            },
            players: prev.players.map((player) => {
              if (player.playerId !== payload.playerId) {
                return player;
              }
              return {
                ...player,
                gameboard: {
                  ...player.gameboard,
                  hasEscaped: true,
                },
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
