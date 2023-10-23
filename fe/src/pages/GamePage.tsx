import GameBoard from '@components/GameBoard/GameBoard';
import GameHeader from '@components/Header/GameHeader';
import LeftPlayers from '@components/Player/LeftPlayers';
import PlayerTestModal from '@components/Player/PlayerTestModal';
import RightPlayers from '@components/Player/RightPlayers';
import { useState } from 'react';
import { styled } from 'styled-components';

export default function GamePage() {
  // Memo: 테스트용 임시 모달
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

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
          <GameBoard />
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
