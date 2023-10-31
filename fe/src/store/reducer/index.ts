import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { splitAtom } from 'jotai/utils';
import { focusAtom } from 'jotai-optics';
import { initialGame, initialPlayer, initialStock } from './constants';
import { GameType } from './type';

export const gameAtom = atom<GameType>({
  game: initialGame,
  players: initialPlayer,
  stocks: initialStock,
});
gameAtom.debugLabel = 'gameAtom';

export const gameInfoAtom = focusAtom(gameAtom, (optic) => optic.prop('game'));
gameInfoAtom.debugLabel = 'gameInfoAtom';

export const playersAtom = focusAtom(gameAtom, (optic) =>
  optic.prop('players')
);
playersAtom.debugLabel = 'playersAtom';

export const stocksAtom = focusAtom(gameAtom, (optic) => optic.prop('stocks'));
stocksAtom.debugLabel = 'stocksAtom';

export const playerAtomsAtom = splitAtom(playersAtom);

const resetEventRoundAtom = atom(null, (_get, set) => {
  set(gameInfoAtom, (prev) => {
    return {
      ...prev,
      dice: [0, 0],
      eventResult: '',
      currentPlayerId: prev.firstPlayerId,
    };
  });
});

export const useGameInfo = () => useAtom(gameInfoAtom);
export const usePlayers = () => useAtom(playersAtom);

export const useGameValue = () => useAtomValue(gameAtom);
export const useGameInfoValue = () => useAtomValue(gameInfoAtom);
export const usePlayersValue = () => useAtomValue(playersAtom);
export const useStocksValue = () => useAtomValue(stocksAtom);

export const useSetPlayers = () => useSetAtom(playersAtom);
export const useResetEventRound = () => useSetAtom(resetEventRoundAtom);
