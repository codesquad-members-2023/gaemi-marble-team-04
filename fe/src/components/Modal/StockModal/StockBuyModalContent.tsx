import { BASE_WS_URL } from '@api/fetcher';
import { cellImageMap } from '@assets/images';
import { Icon } from '@components/icon/Icon';
import { usePlayerIdValue } from '@store/index';
import { useGameValue } from '@store/reducer';
import { addCommasToNumber } from '@utils/index';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';

type StockBuyModalContentProps = {
  handleClose: () => void;
};

export default function StockBuyModalContent({
  handleClose,
}: StockBuyModalContentProps) {
  // 이름, 테마, 현재 가격, 잔여 주식수
  // 취소, 매수버튼
  // 수량 조절 & 수량에 따른 가격
  // 현재 어떤 타입의 응답을 처리중인지 상태로 둘까?? 모든 사람이 공유할수 있도록
  const { game, players, stocks } = useGameValue();
  const playerId = usePlayerIdValue();
  const { gameId } = useParams();
  const [purchaseQuantity, setPurchaseQuantity] = useState(0);

  const { sendJsonMessage } = useWebSocket(
    `${BASE_WS_URL}/api/games/${gameId}/${playerId}`,
    {
      share: true,
    }
  );

  const handleBuyStock = () => {
    const message = {
      gameId,
      playerId,
      type: 'buy',
      stockName: currentStock?.name,
      quantity: purchaseQuantity,
    };
    sendJsonMessage(message);
  };

  const handlePurchaseQuantity = (perQuantity: number) => {
    setPurchaseQuantity((prev) => (prev += perQuantity));
  };

  const currentPlayer = players.find(
    (player) => player.playerId === game.currentPlayerId
  );

  const currentLocation = currentPlayer?.location;

  const currentStock = stocks.find(
    (stock) => stock.location === currentLocation
  );

  const cashAsset = currentPlayer!.userStatusBoard.cashAsset;
  const totalPrice = purchaseQuantity * currentStock!.price;
  const isOverLimit =
    purchaseQuantity >= currentStock!.quantity || totalPrice >= cashAsset;
  const isUnderLimit = purchaseQuantity <= 0;

  return (
    <ModalContent>
      <StockLogo src={cellImageMap[currentStock!.logo]} />
      <StockInfoTable>
        <tbody>
          <tr>
            <th>주식 이름</th>
            <td>{currentStock!.name}</td>
          </tr>
          <tr>
            <th>주식 테마</th>
            <td>{currentStock!.theme}</td>
          </tr>
          <tr>
            <th>주당 가격</th>
            <td>{addCommasToNumber(currentStock!.price)}</td>
          </tr>
          <tr>
            <th>잔여 수량</th>
            <td>{currentStock!.quantity}</td>
          </tr>
          <tr>
            <th>보유 현금</th>
            <td>{addCommasToNumber(cashAsset)}</td>
          </tr>
          <tr>
            <th>매수 수량</th>
            <td>{purchaseQuantity}</td>
          </tr>
          <tr>
            <th>총 가격</th>
            <td>{addCommasToNumber(totalPrice)}</td>
          </tr>
        </tbody>
      </StockInfoTable>
      {playerId === game.currentPlayerId && (
        <ButtonWrapper>
          <Button className="close" onClick={handleClose}>
            닫기
          </Button>
          <PurchaseQuantityWrapper>
            <AdjustButton
              disabled={isOverLimit}
              onClick={() => handlePurchaseQuantity(5)}
            >
              <Icon name="arrowUp" />
            </AdjustButton>
            <PurchaseQuantity>{purchaseQuantity}</PurchaseQuantity>
            <AdjustButton
              disabled={isUnderLimit}
              onClick={() => handlePurchaseQuantity(-5)}
            >
              <Icon name="arrowDown" />
            </AdjustButton>
          </PurchaseQuantityWrapper>
          <Button className="purchase" onClick={handleBuyStock}>
            매수
          </Button>
        </ButtonWrapper>
      )}
    </ModalContent>
  );
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const StockInfoTable = styled.table`
  border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};
  font-size: ${({ theme }) => theme.fontSize.sMedium};

  th,
  td {
    padding: 0.5rem 3rem;
    border: 1px solid ${({ theme }) => theme.color.neutralBorderStrong};
  }
`;

const StockLogo = styled.img`
  width: 3rem;
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

  &.purchase {
    color: ${({ theme: { color } }) => color.accentText};
    background-color: ${({ theme: { color } }) => color.accentBackground};
  }
`;

const PurchaseQuantityWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PurchaseQuantity = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme: { fontSize } }) => fontSize.medium};
`;

const AdjustButton = styled.button``;
