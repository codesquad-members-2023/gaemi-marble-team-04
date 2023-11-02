import StockSellModal from '@components/Modal/StockSellModal/StockSellModal';
import { Icon } from '@components/icon/Icon';
import useClickScrollButton from '@hooks/useClickScrollButton';
import useGetSocketUrl from '@hooks/useGetSocketUrl';
import { usePlayerIdValue } from '@store/index';
import { useGameInfoValue } from '@store/reducer';
import { PlayerType } from '@store/reducer/type';
import { useState } from 'react';
import { useParams } from 'react-router';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import EmptyCard from './EmptyCard';
import PlayerInfo from './PlayerInfo';
import PlayerStock from './PlayerStock';
import { SCROLL_ONCE } from './constants';

type PlayerCardProps = {
  player: PlayerType;
};

export default function PlayerCard({ player }: PlayerCardProps) {
  const [isStockSellModalOpen, setIsStockSellModalOpen] = useState(false);
  const { ref, handleClickScroll } = useClickScrollButton<HTMLUListElement>({
    width: SCROLL_ONCE,
  });

  const { gameId } = useParams();
  const gameInfo = useGameInfoValue();
  const playerId = usePlayerIdValue();
  const socketUrl = useGetSocketUrl();

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const isReady = player.isReady;
  const isMyButton = player.playerId === playerId;
  const eventTime = gameInfo.currentPlayerId === null;

  const handleReady = () => {
    const message = {
      type: 'ready',
      gameId,
      playerId,
      isReady: !isReady,
    };
    sendJsonMessage(message);
  };

  const toggleStockSellModal = () => {
    setIsStockSellModalOpen((prev) => !prev);
  };

  return (
    <>
      {player.playerId ? (
        <CardWrapper>
          <PlayerInfo player={player} />
          {!!player.userStatusBoard.stockList.length && (
            <>
              <StockWrapper>
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
              </StockWrapper>
            </>
          )}
          {!gameInfo.isPlaying && (
            <Button
              onClick={handleReady}
              disabled={!isMyButton}
              $isReady={isReady}
            >
              {isReady ? '준비완료' : '준비'}
            </Button>
          )}
          {isMyButton && eventTime && (
            <StockSellButton onClick={toggleStockSellModal}>
              매도하기
            </StockSellButton>
          )}
          {isStockSellModalOpen && (
            <StockSellModal handleClose={toggleStockSellModal} />
          )}
        </CardWrapper>
      ) : (
        <EmptyCardWrapper>
          <EmptyCard />
        </EmptyCardWrapper>
      )}
    </>
  );
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Button = styled.button<{ $isReady: boolean }>`
  width: 6rem;
  height: 3rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color }, $isReady }) =>
    $isReady ? color.accentTertiary : color.neutralBackground};

  &:disabled {
    cursor: not-allowed;
  }
`;

const EmptyCardWrapper = styled(CardWrapper)`
  margin: 4.5rem 0;
`;

const StockSellButton = styled.button`
  width: 6rem;
  height: 3rem;
  border: 1px solid;
  border-radius: ${({ theme: { radius } }) => radius.small};
`;
