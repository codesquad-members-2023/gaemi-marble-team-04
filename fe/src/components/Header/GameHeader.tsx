import StatusBoardModal from '@components/Modal/StatusBoardModal/StatusBoardModal';
import { Icon } from '@components/icon/Icon';
import useSound from '@hooks/useSound';
import { ROUTE_PATH } from '@router/constants';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

export default function GameHeader() {
  const navigate = useNavigate();
  const [isStatusBoardModalOpen, setIsStatusBoardModalOpen] = useState(false);

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

  return (
    <>
      <Header>
        <Logo>Gaemi Marble</Logo>
        <IconContainer
          className="status-board"
          onClick={toggleStatusBoardModal}
        >
          <Icon name="statusBoard" size="3rem" color="neutralText" />
        </IconContainer>
        <Navigation>
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
              name="exit"
              size="3rem"
              color="accentText"
              onClick={handleExit}
            />
          </IconContainer>
        </Navigation>
      </Header>
      {isStatusBoardModalOpen && (
        <StatusBoardModal handleClose={toggleStatusBoardModal} />
      )}
      {GameBgm}
    </>
  );
}

const Header = styled.div`
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

const Navigation = styled.div`
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

  &.status-board {
    justify-content: center;
    width: 4rem;
    height: 4rem;
  }
`;
