import { MutableRefObject } from 'react';

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
  events: EventsPayloadType;
  eventResult: EventResultPayloadType;
  goldCard: GoldCardPayloadType;
  expense: ExpensePayloadType;
  prisonDice: PrisonDicePayloadType;
  teleport: TeleportPayloadType;
};

export type GameInfoType = {
  isPlaying: boolean;
  firstPlayerId: string;
  currentPlayerId: string | null;
  dice: number[];
  eventList: RouletteEvent[];
  eventResult: string;
  isMoveFinished: boolean;
  teleportLocation: number | null;
  goldCardInfo: {
    title: string;
    description: string;
  };
  isArrived: boolean;
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
  userStatusBoard: UserStatusType;
  gameboard: GameBoardType;
};

type UserStatusType = {
  cashAsset: number;
  stockList: Pick<StockType, 'name' | 'quantity'>[];
};

export type GameBoardType = {
  ref: MutableRefObject<HTMLDivElement | null> | null;
  status: PlayerStatusType;
  location: number;
  direction: DirectionType;
  coordinates: { x: number; y: number };
  hasEscaped: boolean;
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
  isReady: boolean;
};

export type ReadyPayloadType = {
  playerId: string;
  isReady: boolean;
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

export type EventsPayloadType = {
  events: RouletteEvent[];
};

export type EventResultPayloadType = {
  name: string;
};

export type StockType = {
  logo: string;
  name: string;
  theme: string;
  quantity: number;
  price: number;
  location: number;
};

export type StockActionType = {
  statusBoard: StatusBoardPayloadType;
};

export type StatusBoardPayloadType = {
  stockStatusBoard: Omit<StockType, 'logo'>[];
};

export type RouletteEvent = {
  title: string;
  content: string;
  impact: string;
};

export type PlayerStatusType = 'default' | 'prison' | 'teleport' | 'event';

export type GoldCardPayloadType = {
  title: string;
  description: string;
};

export type DirectionType = 'top' | 'right' | 'bottom' | 'left';

export type PlayerTokenAtom = {
  location: number;
  direction: DirectionType;
  coordinates: { x: number; y: number };
};

export type ExpensePayloadType = {
  playerId: string;
  amount: number;
};

export type PrisonDicePayloadType = {
  playerId: string;
  dice1: number;
  dice2: number;
  hasEscaped: boolean;
};

export type TeleportPayloadType = {
  location: number;
};
