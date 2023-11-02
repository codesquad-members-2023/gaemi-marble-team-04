import { cellImageMap } from '@assets/images';
import { PlayerStatusType } from '@store/reducer/type';
import { addCommasToNumber } from '@utils/index';
import { styled } from 'styled-components';

type CellType = {
  theme?: string;
  name: string;
  logo: string;
  location: number;
};

type Cellprops = {
  cell: CellType;
  price?: number;
  playerStatus: PlayerStatusType;
  targetLocation: number | null;
  selectTargetLocation: (location: number) => void;
};

export default function Cell({
  cell,
  price,
  playerStatus,
  targetLocation,
  selectTargetLocation,
}: Cellprops) {
  const isSelected = targetLocation === cell.location;

  return (
    <Container
      $status={playerStatus}
      $isSelected={isSelected}
      onClick={() => {
        if (playerStatus === 'teleport') {
          selectTargetLocation(cell.location);
          return;
        }
      }}
    >
      {cell.theme && (
        <Header>
          <Logo src={cellImageMap[cell.logo]} />
          <Name>{cell.name}</Name>
        </Header>
      )}
      <Content>
        {!cell.theme && <CellImg src={cellImageMap[cell.logo]} />}
        {price && <span>{addCommasToNumber(price)}</span>}
      </Content>
    </Container>
  );
}

const Container = styled.div<{
  $status: PlayerStatusType;
  $isSelected: boolean;
}>`
  width: 6rem;
  height: 6rem;
  display: flex;
  flex-direction: column;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme }) => theme.color.accentText};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.accentTertiary : theme.color.accentPrimary};
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
