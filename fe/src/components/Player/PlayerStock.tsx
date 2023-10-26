import { cellImageMap } from '@assets/images';
import useHover from '@hooks/useHover';
import useTooltipPosition from '@hooks/useTooltipPosition';
import { StockType } from '@store/reducer/type';
import { styled } from 'styled-components';
import PlayerStockTooltip from './PlayerStockTooltip';

type PlayerStockProps = {
  stockInfo: StockType;
};

export default function PlayerStock({ stockInfo }: PlayerStockProps) {
  const { positionRef, position, calcPosition } =
    useTooltipPosition<HTMLImageElement>();
  const { hoverRef, isHover } = useHover();

  const handleMouseEnter = (event: React.MouseEvent<HTMLImageElement>) => {
    if (calcPosition) {
      calcPosition(event);
    }
  };

  return (
    <>
      <StockImgWrapper>
        <StockImg
          ref={(element) => {
            if (element) {
              positionRef.current = element;
              hoverRef.current = element;
            }
          }}
          src={cellImageMap[stockInfo.name]}
          onMouseEnter={handleMouseEnter}
        />
      </StockImgWrapper>
      {isHover && (
        <PlayerStockTooltip stockInfo={stockInfo} position={position} />
      )}
    </>
  );
}

const StockImgWrapper = styled.li`
  min-width: 3rem;
  position: relative;
  border-radius: ${({ theme }) => theme.radius.small};
  background-color: ${({ theme }) => theme.color.accentText};
`;

const StockImg = styled.img`
  width: 3rem;
  height: 3rem;
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.radius.small};
`;
