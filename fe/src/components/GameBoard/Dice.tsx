import { useGameInfoValue, usePlayers } from '@store/reducer';
import { GameBoardType } from '@store/reducer/type';
import { delay } from '@utils/index';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
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
  const [players, setPlayers] = usePlayers();
  const gameInfo = useGameInfoValue();

  useEffect(() => {
    if (gameInfo.dice[0] === 0 || gameInfo.dice[1] === 0) return;
    rollDice(gameInfo.dice[0], gameInfo.dice[1]);
  }, [gameInfo.dice]);

  const moveToNextCell = (
    x: number,
    y: number,
    tokenCoordinates: { x: number; y: number },
    tokenRef: MutableRefObject<HTMLDivElement | null> | null
  ) => {
    if (!tokenRef) return;
    const ref = tokenRef as MutableRefObject<HTMLDivElement>;
    tokenCoordinates.x += x;
    tokenCoordinates.y += y;
    ref.current.style.transform = `translate(${tokenCoordinates.x}rem, ${tokenCoordinates.y}rem)`;
  };

  const moveToken = async (
    diceCount: number,
    playerGameBoardData: GameBoardType
  ) => {
    const tokenCoordinates = {
      x: playerGameBoardData.coordinates.x,
      y: playerGameBoardData.coordinates.y,
    };
    let tokenDirection = playerGameBoardData.direction;
    let tokenLocation = playerGameBoardData.location;

    for (let i = diceCount; i > 0; i--) {
      const directionData = directions[tokenDirection];
      moveToNextCell(
        directionData.x,
        directionData.y,
        tokenCoordinates,
        playerGameBoardData.ref
      );

      tokenLocation = (tokenLocation + 1) % 24;
      const isCorner = CORNER_CELLS.includes(tokenLocation);

      if (isCorner) {
        tokenDirection = changeDirection(tokenDirection);
      }

      await delay(TOKEN_TRANSITION_DELAY);
    }

    setPlayers((prev) => {
      const targetPlayerIndex = prev.findIndex(
        (player) => player.playerId === gameInfo.currentPlayerId
      );

      return prev.map((player, index) => {
        if (index !== targetPlayerIndex) return player;
        return {
          ...player,
          gameboard: {
            ...player.gameboard,
            location: tokenLocation,
            coordinates: tokenCoordinates,
            direction: tokenDirection,
          },
        };
      });
    });
  };

  const rollDice = (dice1: number, dice2: number) => {
    reactDice.current?.rollAll([dice1, dice2]);
  };

  const rollDone = () => {
    const totalDiceValue = gameInfo.dice[0] + gameInfo.dice[1];
    setDiceValue(totalDiceValue);
    const targetPlayer = players.find(
      (player) => player.playerId === gameInfo.currentPlayerId
    );

    if (!targetPlayer) return;

    moveToken(totalDiceValue, targetPlayer.gameboard);
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
