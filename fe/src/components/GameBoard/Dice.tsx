import useMoveToken from '@hooks/useMoveToken';
import { useGameInfoValue, usePlayers, useSetGameInfo } from '@store/reducer';
import { useEffect, useRef, useState } from 'react';
import ReactDice, { ReactDiceRef } from 'react-dice-complete';
import { styled } from 'styled-components';

export default function Dice() {
  const [diceValue, setDiceValue] = useState(0);
  const reactDice = useRef<ReactDiceRef>(null);
  const [players] = usePlayers();
  const gameInfo = useGameInfoValue();
  const moveToken = useMoveToken();
  const setGameInfo = useSetGameInfo();

  useEffect(() => {
    if (gameInfo.dice[0] === 0 || gameInfo.dice[1] === 0) return;
    rollDice(gameInfo.dice[0], gameInfo.dice[1]);
  }, [gameInfo.dice]);

  const rollDice = (dice1: number, dice2: number) => {
    reactDice.current?.rollAll([dice1, dice2]);
  };

  const rollDone = async () => {
    const totalDiceValue = gameInfo.dice[0] + gameInfo.dice[1];
    setDiceValue(totalDiceValue);
    const targetPlayer = players.find(
      (player) => player.playerId === gameInfo.currentPlayerId
    );

    if (!targetPlayer) return;
    if (!targetPlayer.gameboard.hasEscaped) return;

    await moveToken(totalDiceValue, targetPlayer.gameboard);

    setGameInfo((prev) => {
      return {
        ...prev,
        isArrived: true,
      };
    });
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
