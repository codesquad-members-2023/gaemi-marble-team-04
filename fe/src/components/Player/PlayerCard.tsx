import { Icon } from '@components/icon/Icon';
import useClickScrollButton from '@hooks/useClickScrollButton';
import { PlayerType } from '@store/reducer/type';
import { styled } from 'styled-components';
import EmptyCard from './EmptyCard';
import PlayerInfo from './PlayerInfo';
import PlayerStock from './PlayerStock';
import { SCROLL_ONCE } from './constants';

type PlayerCardProps = {
  player: PlayerType;
};

export default function PlayerCard({ player }: PlayerCardProps) {
  const { ref, handleClickScroll } = useClickScrollButton<HTMLUListElement>({
    width: SCROLL_ONCE,
  });

  return (
    <>
      {player.playerId ? (
        <CardWrapper>
          <PlayerInfo player={player} />
          <StockWrapper>
            {!!player.userStatusBoard.stockList.length && (
              <>
                <ArrowButton onClick={() => handleClickScroll()}>
                  <Icon name="arrowLeft" color="accentText" />
                </ArrowButton>
                <PlayerStockList ref={ref}>
                  {player.userStatusBoard.stockList.map((stock) => (
                    <PlayerStock key={stock.name} stockInfo={stock} />
                  ))}
                </PlayerStockList>
                <ArrowButton onClick={() => handleClickScroll(true)}>
                  <Icon name="arrowRight" color="accentText" />
                </ArrowButton>
              </>
            )}
          </StockWrapper>
        </CardWrapper>
      ) : (
        <EmptyCard />
      )}
    </>
  );
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const StockWrapper = styled.div`
  width: 22rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
`;

const PlayerStockList = styled.ul`
  flex: 1;
  display: flex;
  gap: 0.5rem;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ArrowButton = styled.button`
  width: 1rem;
  height: 3rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  background-color: ${({ theme: { color } }) => color.neutralBackgroundBold};
`;
