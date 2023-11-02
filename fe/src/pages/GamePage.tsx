import GameBoard from '@components/GameBoard/GameBoard';
import GameHeader from '@components/Header/GameHeader';
import GoldCardModal from '@components/Modal/GoldCardModal/GoldCardModal';
import LeftPlayers from '@components/Player/LeftPlayers';
import RightPlayers from '@components/Player/RightPlayers';
import useGetSocketUrl from '@hooks/useGetSocketUrl';
import { usePlayerIdValue } from '@store/index';
import { useGameInfoValue, usePlayersValue } from '@store/reducer';
import useGameReducer from '@store/reducer/useGameReducer';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import { goldCardLocation } from './constants';

export default function GamePage() {
  const { gameId } = useParams();
  const playersInfo = usePlayersValue();
  const playerId = usePlayerIdValue();
  const {
    isMoveFinished,
    currentPlayerId,
    isPlaying,
    goldCardInfo,
    isArrived,
  } = useGameInfoValue();
  const { dispatch } = useGameReducer();
  const socketUrl = useGetSocketUrl();

  // playersInfo에 빈 플레이어 객체일때는 isReady를 체크하지 않음
  const isEveryoneReady = playersInfo.every(
    (player) => player.playerId === '' || player.isReady
  );

  const { sendJsonMessage, lastMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  // Memo: dependency에 dispatch 추가시 무한렌더링
  useEffect(() => {
    if (lastMessage !== null) {
      const messageFromServer = JSON.parse(lastMessage?.data);
      dispatch({
        type: messageFromServer.type,
        payload: messageFromServer.data,
      });
    }
  }, [lastMessage]);

  const handleStart = () => {
    const message = {
      type: 'start',
      gameId,
    };
    sendJsonMessage(message);
  };

  const isCurrentPlayer = currentPlayerId === playerId;
  const currentLocation = playersInfo.find(
    (player) => player.playerId === playerId
  )?.location;
  const isLocateGoldCard = goldCardLocation.includes(currentLocation ?? 0);

  return (
    <>
      <Container>
        <GameHeader />
        <Main>
          <LeftPlayers />
          <GameBoard />
          <RightPlayers />
          {!isPlaying && isEveryoneReady && (
            <Button onClick={handleStart}>게임 시작</Button>
          )}
        </Main>
      </Container>
      {isLocateGoldCard &&
        isMoveFinished &&
        isCurrentPlayer &&
        isArrived &&
        goldCardInfo.title && <GoldCardModal />}
    </>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  color: ${({ theme: { color } }) => color.accentText};
  background-color: ${({ theme: { color } }) => color.accentPrimary};
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
`;

const Button = styled.button`
  width: 6rem;
  height: 4rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
`;
