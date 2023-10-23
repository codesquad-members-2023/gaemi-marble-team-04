import { cellImageMap } from '@assets/images';
import { StockType } from '@store/reducer/type';
import { styled } from 'styled-components';

type PlayerStockProps = {
  stockInfo: StockType;
};

export default function PlayerStock({ stockInfo }: PlayerStockProps) {
  return (
    <StockImgWrapper>
      <StockImg src={cellImageMap[stockInfo.name]} />
    </StockImgWrapper>
  );
}

const StockImgWrapper = styled.li`
  width: 3rem;
  border-radius: ${({ theme }) => theme.radius.small};
  background-color: ${({ theme }) => theme.color.accentText};
`;

const StockImg = styled.img`
  width: 3rem;
`;
