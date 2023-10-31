import StatusBoardModal from '@components/Modal/StatusBoardModal/StatusBoardModal';
import StockBuyModal from '@components/Modal/StockModal/StockBuyModal';
import { Icon } from '@components/icon/Icon';
import useSound from '@hooks/useSound';
import { ROUTE_PATH } from '@router/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function GameHeader() {
  const navigate = useNavigate();
  const [isStatusBoardModalOpen, setIsStatusBoardModalOpen] = useState(false);
  const [isStockBuyModalOpen, setIsStockBuyModalOpen] = useState(false);
  const {
    isSoundPlaying,
    togglePlayingSound,
    sound: GameBgm,
  } = useSound({
    src: '/bgm/game.mp3',
  });

  const handleExit = () => {
    navigate(ROUTE_PATH.HOME);
  };

  const handleOpenStatusBoardModal = () => {
    setIsStatusBoardModalOpen(true);
  };

  const handleCloseStatusBoardModal = () => {
    setIsStatusBoardModalOpen(false);
  };

  const toggleStockBuyModal = () => {
    setIsStockBuyModalOpen((prev) => !prev);
  };

  return (
    <>
      <Header>
        <Logo>Gaemi Marble</Logo>
        <Temp>
          <IconContainer onClick={toggleStockBuyModal}>칸도착</IconContainer>
          <IconContainer>
            <Icon
              name={isSoundPlaying ? 'soundPlaying' : 'soundMute'}
              size="3rem"
              color="neutralText"
              onClick={togglePlayingSound}
            />
          </IconContainer>
          <IconContainer>
            <Icon
              name="statusBoard"
              size="3rem"
              color="neutralText"
              onClick={handleOpenStatusBoardModal}
            />
          </IconContainer>
          <IconContainer>
            <Icon
              name="exit"
              size="3rem"
              color="accentText"
              onClick={handleExit}
            />
          </IconContainer>
        </Temp>
      </Header>
      {isStatusBoardModalOpen && (
        <StatusBoardModal handleClose={handleCloseStatusBoardModal} />
      )}
      {isStockBuyModalOpen && (
        <StockBuyModal handleClose={toggleStockBuyModal} />
      )}
      {GameBgm}
    </>
  );
}

const Header = styled.div`
  #sound {
    display: none;
  }
  width: 100%;
  display: flex;
  position: fixed;
  top: 0.5rem;
  padding: 0 2rem;
  justify-content: space-between;
`;

const Logo = styled.h1`
  font-size: ${({ theme: { fontSize } }) => fontSize.medium};
  color: ${({ theme: { color } }) => color.accentText};
`;

// Todo: have to delete!!!
const Temp = styled.div`
  display: flex;
  gap: 1rem;
`;

const IconContainer = styled.div`
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  border-radius: ${({ theme: { radius } }) => radius.half};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
  cursor: pointer;

  &:hover {
    color: ${({ theme: { color } }) => color.accentText};
    background-color: ${({ theme: { color } }) => color.accentSecondary};

    svg path {
      fill: ${({ theme: { color } }) => color.accentText};
    }
  }
`;
