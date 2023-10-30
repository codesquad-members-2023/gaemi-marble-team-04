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

const playerToken2 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});

const playerToken3 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});

const playerToken4 = atom<PlayerTokenAtom>({
  location: 0,
  direction: 'top',
  coordinates: { x: 0, y: 0 },
});

export const usePlayerToken1 = (): [
  PlayerTokenAtom,
  (value: PlayerTokenAtom) => void,
] => useAtom<PlayerTokenAtom>(playerToken1);
export const usePlayerToken2 = (): [
  PlayerTokenAtom,
  (value: PlayerTokenAtom) => void,
] => useAtom<PlayerTokenAtom>(playerToken2);
export const usePlayerToken3 = (): [
  PlayerTokenAtom,
  (value: PlayerTokenAtom) => void,
] => useAtom<PlayerTokenAtom>(playerToken3);
export const usePlayerToken4 = (): [
  PlayerTokenAtom,
  (value: PlayerTokenAtom) => void,
] => useAtom<PlayerTokenAtom>(playerToken4);
