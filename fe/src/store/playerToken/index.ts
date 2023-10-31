import { atom, useAtom } from 'jotai';

export type DirectionType = 'top' | 'right' | 'bottom' | 'left';

export type PlayerTokenAtom = {
  location: number;
  direction: DirectionType;
  coordinates: { x: number; y: number };
};

const playerToken1 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});
playerToken1.debugLabel = 'playerToken1';

const playerToken2 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});
playerToken2.debugLabel = 'playerToken2';

const playerToken3 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});
playerToken3.debugLabel = 'playerToken3';

const playerToken4 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});
playerToken4.debugLabel = 'playerToken4';

export const usePlayerToken1 = (): [
  PlayerTokenAtom,
  (prev: PlayerTokenAtom) => PlayerTokenAtom,
] => useAtom<PlayerTokenAtom>(playerToken1);
export const usePlayerToken2 = (): [
  PlayerTokenAtom,
  (prev: PlayerTokenAtom) => PlayerTokenAtom,
] => useAtom<PlayerTokenAtom>(playerToken2);
export const usePlayerToken3 = (): [
  PlayerTokenAtom,
  (prev: PlayerTokenAtom) => PlayerTokenAtom,
] => useAtom<PlayerTokenAtom>(playerToken3);
export const usePlayerToken4 = (): [
  PlayerTokenAtom,
  (prev: PlayerTokenAtom) => PlayerTokenAtom,
] => useAtom<PlayerTokenAtom>(playerToken4);
