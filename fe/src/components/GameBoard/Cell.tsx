import { cellImageMap } from '@assets/images';
import { styled } from 'styled-components';

type Cellprops = {
  theme?: string;
  name: string;
  logo: string;
  sharePrice?: number;
};

export default function Cell({ theme, name, logo, sharePrice }: Cellprops) {
  const addCommasToNumber = (number: number): string => {
    return `${number.toLocaleString('ko')}`;
  };

  return (
    <Container>
      {theme && (
        <Header>
          <Logo src={cellImageMap[logo]} />
          <Name>{name}</Name>
        </Header>
      )}
      <Content>
        {!theme && <CellImg src={cellImageMap[logo]} />}
        {sharePrice && <span>{addCommasToNumber(sharePrice)}</span>}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 6rem;
  height: 6rem;
  display: flex;
  flex-direction: column;
  border: 1px solid;
  border-color: ${({ theme: { color } }) => color.accentText};
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  background-color: ${({ theme: { color } }) => color.accentText};
`;

const Logo = styled.img`
  width: 1.5rem;
  height: 1.5rem;
`;

const CellImg = styled.img`
  width: 5rem;
  height: 5rem;
`;

const Name = styled.div`
  color: ${({ theme: { color } }) => color.accentPrimary};
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
