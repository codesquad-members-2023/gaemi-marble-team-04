import PlayerTestModal from '@components/Modal/PlayerTestModal';
import StatusBoardModal from '@components/Modal/StatusBoardModal/StatusBoardModal';
import { Icon } from '@components/icon/Icon';
import useSound from '@hooks/useSound';
import { ROUTE_PATH } from '@router/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function GameHeader() {
  const navigate = useNavigate();
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isStatusBoardModalOpen, setIsStatusBoardModalOpen] = useState(false);
  const {
    isSoundPlaying,
    togglePlayingSound,
    sound: GameBgm,
  } = useSound({
    src: '/src/assets/bgm/game.mp3',
  });

  const handleExit = () => {
    navigate(ROUTE_PATH.HOME);
  };

  const handleOpenTestModal = () => {
    setIsTestModalOpen(true);
  };

  const handleCloseTestModal = () => {
    setIsTestModalOpen(false);
  };

  const handleOpenStatusBoardModal = () => {
    setIsStatusBoardModalOpen(true);
  };

  const handleCloseStatusBoardModal = () => {
    setIsStatusBoardModalOpen(false);
  };

  return (
    <>
      <Header>
        <Logo>Gaemi Marble</Logo>
        <Temp>
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
              name="sample"
              size="3rem"
              color="neutralText"
              onClick={handleOpenTestModal}
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
      {isTestModalOpen && (
        <PlayerTestModal handleClose={handleCloseTestModal} />
      )}
      {isStatusBoardModalOpen && (
        <StatusBoardModal handleClose={handleCloseStatusBoardModal} />
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
  border-radius: ${({ theme: { radius } }) => radius.half};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme: { color } }) => color.accentSecondary};

    svg path {
      fill: ${({ theme: { color } }) => color.accentText};
    }
  }
`;
