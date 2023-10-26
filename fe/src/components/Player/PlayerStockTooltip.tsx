import { StockType } from '@store/reducer/type';
import { styled } from 'styled-components';

type Position = {
  left?: number | null;
  right?: number | null;
  top?: number | null;
  bottom?: number | null;
};

type PlayerStockTooltipProps = {
  stockInfo: StockType;
  position: Position;
};

export default function PlayerStockTooltip({
  stockInfo,
  position,
}: PlayerStockTooltipProps) {
  return (
    <StockTooltip $position={position}>
      <div>이름: {stockInfo.name}</div>
      <div>수량: {stockInfo.quantity}</div>
      <div>1주당 가격: {stockInfo.price}</div>
    </StockTooltip>
  );
}

const StockTooltip = styled.div<{ $position: Position }>`
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
