import StatusBoardModal from '@components/Modal/StatusBoardModal/StatusBoardModal';
import StockBuyModal from '@components/Modal/StockBuyModal/StockBuyModal';
import StockSellModal from '@components/Modal/StockSellModal/StockSellModal';
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
  const [isStockSellModalOpen, setIsStockSellModalOpen] = useState(false);
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

  const toggleStatusBoardModal = () => {
    setIsStatusBoardModalOpen((prev) => !prev);
  };

  const toggleStockBuyModal = () => {
    setIsStockBuyModalOpen((prev) => !prev);
  };

  const toggleStockSellModal = () => {
    setIsStockSellModalOpen((prev) => !prev);
  };

  return (
    <>
      <Header>
        <Logo>Gaemi Marble</Logo>
        <Temp>
          <IconContainer onClick={toggleStockSellModal}>매도하기</IconContainer>
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
              onClick={toggleStatusBoardModal}
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
        <StatusBoardModal handleClose={toggleStatusBoardModal} />
      )}
      {isStockBuyModalOpen && (
        <StockBuyModal handleClose={toggleStockBuyModal} />
      )}
      {isStockSellModalOpen && (
        <StockSellModal handleClose={toggleStockSellModal} />
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
  top: 0.5rem;
  padding: 0 2rem;
  margin: 1rem 0;
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
