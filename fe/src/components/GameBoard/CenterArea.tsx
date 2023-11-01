import useGetSocketUrl from '@hooks/useGetSocketUrl';
import useHover from '@hooks/useHover';
import { usePlayerIdValue } from '@store/index';
import { useGameInfoValue, usePlayersValue } from '@store/reducer';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import Dice from './Dice';
import Roulette from './Roulette';

export default function CenterArea() {
  const [isMoveFinished, setIsMoveFinished] = useState(false);
  const { hoverRef: bailRef, isHover: isBailBtnHover } =
    useHover<HTMLButtonElement>();
  const { hoverRef: escapeRef, isHover: isEscapeBtnHover } =
    useHover<HTMLButtonElement>();
  const { gameId } = useParams();
  const players = usePlayersValue();
  const gameInfo = useGameInfoValue();
  const playerId = usePlayerIdValue();
  const socketUrl = useGetSocketUrl();
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const eventTime = gameInfo.currentPlayerId === null;
  const isMyTurn = playerId === gameInfo.currentPlayerId;
  const currentPlayerLocation = players.find(
    (player) => player.playerId === gameInfo.currentPlayerId
  )?.location;
  const isPrison = currentPlayerLocation === 6;
  const defaultStart = !eventTime && isMyTurn && !isPrison && !isMoveFinished;
  const prisonStart = !eventTime && isMyTurn && isPrison && !isMoveFinished;
  // TODO: teleport 구현 필요

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
    setIsMoveFinished(false);
    const message = {
      type: 'endTurn',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  const handleFinishMove = useCallback(() => {
    setIsMoveFinished(true);
  }, []);

  const handleBail = () => {
    const message = {
      type: 'expense',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  const handleEscape = () => {
    const message = {
      type: 'prisonDice',
      gameId,
      playerId,
    };
    sendJsonMessage(message);
  };

  return (
    <Center>
      {eventTime && <Roulette />}
      {!eventTime && <Dice finishMove={handleFinishMove} />}
      {defaultStart && (
        <>
          <Button onClick={() => throwDice()} disabled={isMoveFinished}>
            굴리기
          </Button>
        </>
      )}
      {prisonStart && (
        <Wrapper>
          <Button ref={bailRef} onClick={handleBail}>
            {isBailBtnHover ? '-5,000,000₩' : '보석금 지불'}
          </Button>
          <Button ref={escapeRef} onClick={handleEscape}>
            {isEscapeBtnHover ? '주사위 더블시 탈출' : '굴려서 탈출'}
          </Button>
        </Wrapper>
      )}
      {isMoveFinished && <Button onClick={() => endTurn()}>턴종료</Button>}
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

const Wrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  width: 8rem;
  height: 4rem;
  padding: 0.5rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.neutralBackground};

  &:disabled {
    opacity: 0.6;
  }
`;
