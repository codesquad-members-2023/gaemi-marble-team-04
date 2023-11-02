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
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import { goldCardLocation } from './constants';

export default function GamePage() {
  const playersInfo = usePlayersValue();
  const playerId = usePlayerIdValue();
  const { isMoveFinished, currentPlayerId, goldCardInfo, isArrived } =
    useGameInfoValue();
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
