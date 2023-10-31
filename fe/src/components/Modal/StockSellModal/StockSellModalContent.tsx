// import { cellImageMap } from '@assets/images';
import useGetSocketUrl from '@hooks/useGetSocketUrl';
import { usePlayerIdValue } from '@store/index';
import { useGameValue } from '@store/reducer';
import { addCommasToNumber } from '@utils/index';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import StockSellTableData from './StockSellTableData';

type StockSellModalContentProps = {
  handleClose: () => void;
};

export default function StockSellModalContent({
  handleClose,
}: StockSellModalContentProps) {
  const { game, players, stocks } = useGameValue();
  const playerId = usePlayerIdValue();
  const { gameId } = useParams();
  const socketUrl = useGetSocketUrl();
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });
  const [salesList, setSalesList] = useState<
    { name: string; quantity: number }[]
  >(
    stocks.map((stock) => {
      return { name: stock.name, quantity: 0 };
    })
  );

  const handleSellStock = () => {
    const sellList = salesList.filter((stock) => stock.quantity);

    const message = {
      gameId,
      playerId,
      type: 'sell',
      stockList: sellList,
    };
    sendJsonMessage(message);

    handleClose();
  };

  const handleSalesQuantity = ({
    name,
    perQuantity,
  }: {
    name: string;
    perQuantity: number;
  }) => {
    setSalesList((prev) =>
      prev.map((stock) =>
        stock.name === name
          ? { ...stock, quantity: stock.quantity + perQuantity }
          : stock
      )
    );
  };

  const player = players.find((player) => player.playerId === playerId);
  const playerStocks = player?.userStatusBoard.stockList;
  const totalPrice = salesList.reduce((acc, saleInfo) => {
    const stock = stocks.find((stock) => stock.name === saleInfo.name);
    if (!stock) {
      return acc;
    }

    return (acc += stock.price * saleInfo.quantity);
  }, 0);

  return (
    <ModalContent>
      <StockInfoTable>
        <thead>
          <tr>
            <th>주식 로고</th>
            <th>주식 이름</th>
            <th>주식 테마</th>
            <th className="price">주당 가격</th>
            <th>잔여 수량</th>
            <th>매도 수량</th>
            <th className="price">매도 가격</th>
          </tr>
        </thead>
        <tbody>
          {!!playerStocks?.length &&
            playerStocks.map((stock) => (
              <StockSellTableData
                stock={stock}
                salesList={salesList}
                handleSalesQuantity={handleSalesQuantity}
              />
            ))}
        </tbody>
      </StockInfoTable>
      <span>총 매도 가격: {addCommasToNumber(totalPrice)}</span>
      {playerId === game.currentPlayerId && (
        <ButtonWrapper>
          <Button className="close" onClick={handleClose}>
            닫기
          </Button>
          <Button className="sell" onClick={handleSellStock}>
            매도
          </Button>
        </ButtonWrapper>
      )}
    </ModalContent>
  );
}

const ModalContent = styled.div`
  width: 70rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  span {
    font-size: ${({ theme }) => theme.fontSize.sMedium};
    margin: auto 0 auto auto;
  }
`;

const StockInfoTable = styled.table`
  border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};
  font-size: ${({ theme }) => theme.fontSize.sMedium};

  th,
  td {
    padding: 0.2rem 0.5rem;
    border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};

    &.price {
      width: 20%;
    }
  }

  td {
    text-align: right;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5rem;
`;

const Button = styled.button`
  width: 7rem;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: ${({ theme: { color } }) => `1px solid ${color.accentBorder}`};
  border-radius: ${({ theme: { radius } }) => radius.medium};
  font-size: ${({ theme: { fontSize } }) => fontSize.medium};
  cursor: pointer;

  &.close {
    color: ${({ theme: { color } }) => color.accentText};
    background-color: ${({ theme: { color } }) => color.systemWarning};
  }

  &.sell {
    color: ${({ theme: { color } }) => color.accentText};
    background-color: ${({ theme: { color } }) => color.accentBackground};
  }
`;
