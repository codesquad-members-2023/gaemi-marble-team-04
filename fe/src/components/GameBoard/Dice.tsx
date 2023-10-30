import {
  PlayerTokenAtom,
  usePlayerToken1,
  usePlayerToken2,
  usePlayerToken3,
  usePlayerToken4,
} from '@store/playerToken';
import { useGameInfoValue, usePlayersValue } from '@store/reducer';
import { delay } from '@utils/index';
import {
  ForwardedRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDice, { ReactDiceRef } from 'react-dice-complete';
import { styled } from 'styled-components';
import {
  CORNER_CELLS,
  TOKEN_TRANSITION_DELAY,
  changeDirection,
  directions,
} from './constants';

export default function Dice() {
  const [diceValue, setDiceValue] = useState(0);
  const reactDice = useRef<ReactDiceRef>(null);
  const [token1, setToken1] = usePlayerToken1();
  const [token2, setToken2] = usePlayerToken2();
  const [token3, setToken3] = usePlayerToken3();
  const [token4, setToken4] = usePlayerToken4();

  const gameInfo = useGameInfoValue();
  const players = usePlayersValue();

  const tokenList: {
    [key: number]: {
      atom: PlayerTokenAtom;
      setAtom: (prev: PlayerTokenAtom) => PlayerTokenAtom;
    };
  } = {
    1: { atom: token1, setAtom: setToken1 },
    2: { atom: token2, setAtom: setToken2 },
    3: { atom: token3, setAtom: setToken3 },
    4: { atom: token4, setAtom: setToken4 },
  };

  useEffect(() => {
    if (gameInfo.dice[0] === 0 || gameInfo.dice[1] === 0) return;
    rollDice(gameInfo.dice[0], gameInfo.dice[1]);
  }, [gameInfo.dice]);

  const moveToNextCell = (
    x: number,
    y: number,
    tokenRef: ForwardedRef<HTMLDivElement>,
    tokenAtom: PlayerTokenAtom
  ) => {
    if (!tokenRef) return;
    const ref = tokenRef as MutableRefObject<HTMLDivElement>;
    tokenAtom.coordinates.x += x;
    tokenAtom.coordinates.y += y;
    ref.current.style.transform = `translate(${tokenAtom.coordinates.x}rem, ${tokenAtom.coordinates.y}rem)`;
  };

  const moveToken = useCallback(
    async (
      diceCount: number,
      tokenRef: ForwardedRef<HTMLDivElement>,
      tokenAtom: PlayerTokenAtom,
      setTokenAtom: (prev: PlayerTokenAtom) => PlayerTokenAtom
    ) => {
      const tokenCoordinates = tokenAtom.coordinates;
      let tokenDirection = tokenAtom.direction;
      let tokenLocation = tokenAtom.location;

      for (let i = diceCount; i > 0; i--) {
        const directionData = directions[tokenDirection];
        moveToNextCell(directionData.x, directionData.y, tokenRef, tokenAtom);

        tokenLocation = (tokenLocation + 1) % 24;
        const isCorner = CORNER_CELLS.includes(tokenLocation); // 0, 6, 12, 18 칸에서 방향 전환

        if (isCorner) {
          tokenDirection = changeDirection(tokenDirection);
        }

        await delay(TOKEN_TRANSITION_DELAY);
      }

      setTokenAtom({
        coordinates: tokenCoordinates,
        direction: tokenDirection,
        location: tokenLocation,
      });
    },
    []
  );

  const rollDice = (dice1: number, dice2: number) => {
    reactDice.current?.rollAll([dice1, dice2]);
  };

  const rollDone = () => {
    setDiceValue(gameInfo.dice[0] + gameInfo.dice[1]);
    const targetPlayer = players.find(
      (player) => player.playerId === gameInfo.currentPlayerId
    );

    if (!targetPlayer) return;

    const targetTokenAtom = tokenList[targetPlayer.order].atom;
    const setTargetTokenAtom = tokenList[targetPlayer.order].setAtom;
    moveToken(
      gameInfo.dice[0] + gameInfo.dice[1],
      targetPlayer.tokenRef,
      targetTokenAtom,
      setTargetTokenAtom
    );
  };

  return (
    <>
      <ReactDice
        numDice={2}
        ref={reactDice}
        rollDone={rollDone}
        rollTime={0.5}
        faceColor="#fff"
        dotColor="#000"
        disableIndividual={true}
      />
      <DiceValue>{diceValue}</DiceValue>
    </>
  );
}

const DiceValue = styled.div`
  font-size: ${({ theme }) => theme.fontSize.medium};
`;
