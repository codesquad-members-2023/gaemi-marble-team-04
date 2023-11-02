import GameBoard from '@components/GameBoard/GameBoard';
import GameHeader from '@components/Header/GameHeader';
import LeftPlayers from '@components/Player/LeftPlayers';
import RightPlayers from '@components/Player/RightPlayers';
import useGetSocketUrl from '@hooks/useGetSocketUrl';
import useGameReducer from '@store/reducer/useGameReducer';
import { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';

export default function GamePage() {
  const { dispatch } = useGameReducer();
  const socketUrl = useGetSocketUrl();

  const { lastMessage } = useWebSocket(socketUrl, {
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

  return (
    <>
      <Container>
        <GameHeader />
        <Main>
          <LeftPlayers />
          <GameBoard />
          <RightPlayers />
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
  align-items: center;
  flex: 1;
  color: ${({ theme: { color } }) => color.accentText};
`;

const Main = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding: 0 1rem;
`;
