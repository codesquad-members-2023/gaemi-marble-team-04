import { ForwardedRef } from 'react';

export type GameType = {
  game: GameInfoType;
  players: PlayerType[];
  stocks: StockType[];
};

export type GameActionType = {
  start: StartPayloadType;
  endTurn: EndTurnPayloadType;
  dice: DicePayloadType;
  enter: EnterPayloadType[];
  ready: ReadyPayloadType;
  userStatusBoard: UserStatusPayloadType;
  cell: CellPayloadType;
  statusBoard: StatusBoardPayloadType;
};

export type GameInfoType = {
  // Memo: 현재 게임이 진행중인지
  isPlaying: boolean;
  // Memo: 현재 턴이 누군지
  currentPlayerId: string;
  // Memo: 턴인 사람의 상태 (default, prison, teleport ...)
  currentPlayerStatus: { type: string; count?: number };
  dice: number[];
};

export type StartPayloadType = {
  playerId: string;
};

export type EndTurnPayloadType = {
  nextPlayerId: string;
  nextPlayerStatus: { type: string; count?: number };
};

export type DicePayloadType = {
  dice1: number;
  dice2: number;
};

export type PlayerType = {
  playerId: string;
  order: number;
  isReady: boolean;
  location: number;
  tokenRef: ForwardedRef<HTMLDivElement> | null;
  userStatusBoard: UserStatusType;
};

type UserStatusType = {
  cashAsset: number;
  stockAsset: number;
  totalAsset: number;
  stockList: StockType[];
};

export type PlayerActionType = {
  enter: EnterPayloadType[];
  ready: ReadyPayloadType;
  userStatusBoard: UserStatusPayloadType;
  cell: CellPayloadType;
};

export type EnterPayloadType = {
  order: number;
  playerId: string;
};

export type ReadyPayloadType = {
  playerId: string;
  isReady: true;
};

export type UserStatusPayloadType = {
  playerId: string;
  userStatusBoard: UserStatusType;
};

export type CellPayloadType = {
  playerId: string;
  location: number;
  salary: number;
  dividend: number;
};

export type StockType = {
  logo: string;
  name: string;
  theme: string;
  quantity: number;
  price: number;
};

export type StockActionType = {
  statusBoard: StatusBoardPayloadType;
};

export type StatusBoardPayloadType = {
  stockStatusBoard: Omit<StockType, 'logo'>[];
};
