import useGetSocketUrl from '@hooks/useGetSocketUrl';
import { usePlayerIdValue } from '@store/index';
import { useGameInfoValue } from '@store/reducer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import Dice from './Dice';
import Roulette from './Roulette';

export default function CenterArea() {
  const { gameId } = useParams();
  const gameInfo = useGameInfoValue();
  const playerId = usePlayerIdValue();
  const socketUrl = useGetSocketUrl();
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const eventTime = gameInfo.currentPlayerId === null;
  const isMyTurn = playerId === gameInfo.currentPlayerId;

  useEffect(() => {
    if (!eventTime) return;
    if (gameInfo.firstPlayerId !== playerId) return;
    const message = {
      type: 'events',
      gameId,
    };
    sendJsonMessage(message);
  }, [eventTime, gameId, playerId, gameInfo.firstPlayerId, sendJsonMessage]);

  const throwDice = () => {
    const message = {
      type: 'dice',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  const endTurn = () => {
    const message = {
      type: 'endTurn',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  return (
    <Center>
      {!eventTime && <Dice />}
      {eventTime && <Roulette />}
      {!eventTime && isMyTurn && (
        <>
          <Button onClick={() => throwDice()}>굴리기</Button>
          <Button onClick={() => endTurn()}>턴종료</Button>
        </>
      )}
    </Center>
  );
}

const Center = styled.div`
  width: 30rem;
  height: 30rem;
  position: absolute;
  top: 6rem;
  left: 6rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const Button = styled.button`
  width: 6rem;
  height: 4rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
`;