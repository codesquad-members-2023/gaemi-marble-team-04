import { atom, useAtom, useAtomValue } from 'jotai';
import { focusAtom } from 'jotai-optics';
import { initialGame, initialPlayer, initialStock } from './constants';
import { GameType } from './type';

export const gameAtom = atom<GameType>({
  game: initialGame,
  players: initialPlayer,
  stocks: initialStock,
});

export const gameInfoAtom = focusAtom(gameAtom, (optic) => optic.prop('game'));
export const playersAtom = focusAtom(gameAtom, (optic) =>
  optic.prop('players')
);
export const stocksAtom = focusAtom(gameAtom, (optic) => optic.prop('stocks'));

export const useGameValue = () => useAtomValue(gameAtom);
export const useGameInfoValue = () => useAtomValue(gameInfoAtom);
export const usePlayersValue = () => useAtomValue(playersAtom);
export const useStocksValue = () => useAtomValue(stocksAtom);

export const useGameInfo = () => useAtom(gameInfoAtom);
