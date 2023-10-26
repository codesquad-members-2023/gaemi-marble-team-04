import { BASE_WS_URL } from '@api/fetcher';
import { usePlayerIdValue } from '@store/index';
import { useGameInfoValue } from '@store/reducer';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import Dice from './Dice';

export default function CenterArea() {
  const { gameId } = useParams();
  const gameInfo = useGameInfoValue();
  const playerId = usePlayerIdValue();
  const { sendJsonMessage } = useWebSocket(BASE_WS_URL, {
    share: true,
  });

  const isMyTurn = playerId === gameInfo.currentPlayerId;

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
      <Dice />
      {/* 이후 이벤트 룰렛 구현 예정 <Roulette /> */}
      {isMyTurn && (
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
