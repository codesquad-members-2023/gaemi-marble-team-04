import { useStocksValue } from '@store/reducer';
import { StockType } from '@store/reducer/type';
import { addCommasToNumber } from '@utils/index';
import { styled } from 'styled-components';

type Position = {
  left?: number | null;
  right?: number | null;
  top?: number | null;
  bottom?: number | null;
};

type PlayerStockTooltipProps = {
  stockInfo: Pick<StockType, 'name' | 'quantity'>;
  position: Position;
};

export default function PlayerStockTooltip({
  stockInfo,
  position,
}: PlayerStockTooltipProps) {
  const stocks = useStocksValue();

  const stockPrice = stocks.find(
    (stock) => stock.name === stockInfo.name
  )!.price;

  return (
    <StockTooltip $position={position}>
      <div>이름: {stockInfo.name}</div>
      <div>수량: {stockInfo.quantity}</div>
      <div>1주당 가격: {addCommasToNumber(stockPrice)}</div>
    </StockTooltip>
  );
}

const StockTooltip = styled.div<{ $position: Position }>`
  z-index: 1;
  position: fixed;
  left: ${({ $position }) => $position && $position.left}px;
  right: ${({ $position }) => $position && $position.right}px;
  top: ${({ $position }) => $position && $position.top}px;
  bottom: ${({ $position }) => $position && $position.bottom}px;
  padding: 1rem;
  border: ${({ theme: { color } }) => `1px solid ${color.neutralBorder}`};
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.systemBackground};
`;
