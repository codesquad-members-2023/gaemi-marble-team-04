import { BASE_WS_URL } from '@api/fetcher';
import GameBoard from '@components/GameBoard/GameBoard';
import GameHeader from '@components/Header/GameHeader';
import LeftPlayers from '@components/Player/LeftPlayers';
import PlayerTestModal from '@components/Player/PlayerTestModal';
import RightPlayers from '@components/Player/RightPlayers';
// import { usePlayerId } from '@store/index';
import useGameReducer from '@store/reducer/useGameReducer';
import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';

export default function GamePage() {
  // Memo: 테스트용 임시 모달
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  // const playerId = usePlayerId();
  // const { gameId } = useParams();
  // const WS_URL = `${BASE_WS_URL}/api/games/${gameId}/${playerId}`;

  const { dispatch } = useGameReducer();
  const { sendJsonMessage, lastMessage } = useWebSocket(BASE_WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
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

  const handleOpenModal = () => {
    setIsTestModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTestModalOpen(false);
  };

  return (
    <>
      <Container>
        <GameHeader handleClickTest={handleOpenModal} />
        <Main>
          <LeftPlayers />
          <GameBoard sendJsonMessage={sendJsonMessage} />
          <RightPlayers />
        </Main>
      </Container>
      {isTestModalOpen && <PlayerTestModal handleClose={handleCloseModal} />}
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
