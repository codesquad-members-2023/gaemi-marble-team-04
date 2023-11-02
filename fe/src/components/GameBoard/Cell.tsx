import { cellImageMap } from '@assets/images';
import { PlayerStatusType } from '@store/reducer/type';
import { addCommasToNumber } from '@utils/index';
import { styled } from 'styled-components';
import { PRISON_CELL } from './constants';

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
  const isPrison = cell.location === PRISON_CELL;

  return (
    <Container
      $status={playerStatus}
      $isSelected={isSelected}
      $isPrison={isPrison}
      onClick={() => {
        if (playerStatus !== 'teleport') return;
        if (cell.location === 18) {
          alert('이동할 수 없는 위치입니다.');
          return;
        }
        selectTargetLocation(cell.location);
        return;
      }}
    >
      {cell.theme && (
        <Header>
          <Name>{cell.name}</Name>
        </Header>
      )}
      <Content>
        {cell.theme && <Logo src={cellImageMap[cell.logo]} />}
        {!cell.theme && <CellImg src={cellImageMap[cell.logo]} />}
        {price && <span>{addCommasToNumber(price)}</span>}
      </Content>
    </Container>
  );
}

const Container = styled.div<{
  $status: PlayerStatusType;
  $isSelected: boolean;
  $isPrison: boolean;
}>`
  width: 6rem;
  height: 6rem;
  display: flex;
  flex-direction: column;
  border: ${({ theme }) => `1px solid ${theme.color.neutralBackgroundBold}`};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.color.accentTertiary : theme.color.accentText};
  box-shadow: ${({ $isPrison }) =>
    $isPrison ? 'none' : '10px 5px 5px rgba(0, 0, 0, 1)'};
`;

const Header = styled.div`
  min-height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
`;

const CellImg = styled.img`
  width: 5rem;
  height: 5rem;
`;

const Name = styled.div`
  color: ${({ theme: { color } }) => color.neutralText};
`;

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  color: ${({ theme: { color } }) => color.neutralText};
`;
