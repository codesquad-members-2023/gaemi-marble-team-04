import { BASE_WS_URL } from '@api/fetcher';
import GameBoard from '@components/GameBoard/GameBoard';
import GameHeader from '@components/Header/GameHeader';
import LeftPlayers from '@components/Player/LeftPlayers';
import RightPlayers from '@components/Player/RightPlayers';
import { usePlayerIdValue, useSetSocketUrl } from '@store/index';
import { useGameInfoValue, usePlayersValue } from '@store/reducer';
import useGameReducer from '@store/reducer/useGameReducer';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';

export default function GamePage() {
  const { gameId } = useParams();
  const playersInfo = usePlayersValue();
  const playerId = usePlayerIdValue();
  const gameInfo = useGameInfoValue();
  const setSocketUrl = useSetSocketUrl();
  const { dispatch } = useGameReducer();

  // playersInfo에 빈 플레이어 객체일때는 isReady를 체크하지 않음
  const isEveryoneReady = playersInfo.every(
    (player) => player.playerId === '' || player.isReady
  );

  const getSocketUrl = useCallback(() => {
    const socketUrl = `${BASE_WS_URL}/api/games/${gameId}/${playerId}`;
    setSocketUrl(socketUrl);

    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(socketUrl);
      }, 100);
    });
  }, [gameId, playerId, setSocketUrl]);

  const { sendJsonMessage, lastMessage } = useWebSocket(getSocketUrl, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
  });

  // dependency에 dispatch 추가시 무한렌더링
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

  return (
    <>
      <Container>
        <GameHeader />
        <Main>
          <LeftPlayers />
          <GameBoard />
          <RightPlayers />
          {!gameInfo.isPlaying && isEveryoneReady && (
            <Button onClick={handleStart}>게임 시작</Button>
          )}
        </Main>
      </Container>
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
