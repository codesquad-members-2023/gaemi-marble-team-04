import useGetSocketUrl from '@hooks/useGetSocketUrl';
import useHover from '@hooks/useHover';
import useMoveToken from '@hooks/useMoveToken';
import { usePlayerIdValue } from '@store/index';
import { useGameInfoValue, usePlayersValue } from '@store/reducer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import Dice from './Dice';
import Roulette from './Roulette';

export default function CenterArea() {
  const { hoverRef: bailRef, isHover: isBailBtnHover } =
    useHover<HTMLButtonElement>();
  const { hoverRef: escapeRef, isHover: isEscapeBtnHover } =
    useHover<HTMLButtonElement>();
  const { gameId } = useParams();
  const players = usePlayersValue();
  const gameInfo = useGameInfoValue();
  const playerId = usePlayerIdValue();
  const socketUrl = useGetSocketUrl();
  const moveToken = useMoveToken();
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const isMyTurn = playerId === gameInfo.currentPlayerId;
  const eventTime = gameInfo.currentPlayerId === null;
  const currentPlayerLocation = players.find(
    (player) => player.playerId === gameInfo.currentPlayerId
  )?.location;
  const isPrison = currentPlayerLocation === 6;
  const isTeleport = currentPlayerLocation === 18;
  const isMoveFinished = gameInfo.isMoveFinished;

  const defaultStart =
    isMyTurn && !eventTime && !isPrison && !isTeleport && !isMoveFinished;
  const prisonStart = isMyTurn && !eventTime && isPrison && !isMoveFinished;
  const teleportStart = isMyTurn && !eventTime && isTeleport && !isMoveFinished;

  // TODO: 순간이동 칸에서 턴 시작시 이동할 칸을 선택하도록 구현
  const targetLocation = 6;

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

  const handleBail = () => {
    const message = {
      type: 'bail',
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

  const handleTeleport = () => {
    const message = {
      type: 'teleport',
      gameId,
      playerId,
      location: targetLocation,
    };
    sendJsonMessage(message);
    teleportToken();
  };

  const teleportToken = () => {
    const playerInfo = players.find((player) => player.playerId === playerId);
    if (!playerInfo) return;
    const cellCount = calculateCellCount(targetLocation, playerInfo.location);
    moveToken(cellCount, playerInfo.gameboard, 'teleport');
  };

  const calculateCellCount = (targetCell: number, currentCell: number) => {
    const cellCount = (24 + targetCell - currentCell) % 24;
    return cellCount;
  };

  return (
    <Center>
      {eventTime && <Roulette />}
      {!eventTime && <Dice />}
      {teleportStart && (
        <>
          <Button onClick={() => throwDice()} disabled={isMoveFinished}>
            굴리기
          </Button>
        </>
      )}
      {prisonStart && (
        <Wrapper>
          <Button ref={bailRef} onClick={handleBail}>
            {/* Memo: 호버시 내부 텍스트가 안 바뀌는 버그 발견 */}
            {isBailBtnHover ? '-5,000,000₩' : '보석금 지불'}
          </Button>
          <Button ref={escapeRef} onClick={handleEscape}>
            {isEscapeBtnHover ? '주사위 더블시 탈출' : '굴려서 탈출'}
          </Button>
        </Wrapper>
      )}
      {defaultStart && (
        <>
          <div>이동할 칸을 선택해주세요</div>
          <Button onClick={() => handleTeleport()}>이동하기</Button>
        </>
      )}
      {isMyTurn && isMoveFinished && (
        <Button onClick={() => endTurn()}>턴종료</Button>
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
