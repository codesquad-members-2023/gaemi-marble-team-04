import { Icon } from '@components/icon/Icon';
import { ROUTE_PATH } from '@router/constants';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

type GameHeaderProps = {
  handleClickTest: () => void;
};

export default function GameHeader({ handleClickTest }: GameHeaderProps) {
  const navigate = useNavigate();

  const handleExit = () => {
    navigate(ROUTE_PATH.HOME);
  };

  return (
    <Header>
      <Logo>Gaemi Marble</Logo>
      <Temp>
        <IconContainer>
          <Icon
            name="sample"
            size="3rem"
            color="neutralText"
            onClick={handleClickTest}
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
  );
}

const Header = styled.div`
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
