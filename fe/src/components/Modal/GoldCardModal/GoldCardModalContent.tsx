import useGetSocketUrl from '@hooks/useGetSocketUrl';
import { usePlayerIdValue } from '@store/index';
import {
  useGameInfoValue,
  usePlayersValue,
  useResetGoldCard,
  useSetGameInfo,
} from '@store/reducer';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { styled } from 'styled-components';
import { DefaultTheme } from 'styled-components/dist/types';

// Memo: 서버에서 골드카드의 유형도 받으면 다른 황금 카드도 구현 가능할 듯
// 예) target: { player: boolean, stock: boolean }
export default function GoldCardModalContent() {
  const { goldCardInfo } = useGameInfoValue();
  const { title, description } = goldCardInfo;
  const { gameId } = useParams();
  const players = usePlayersValue();
  const playerId = usePlayerIdValue();
  const resetGoldCard = useResetGoldCard();
  const setGameInfo = useSetGameInfo();
  const [targetId, setTargetId] = useState('');
  const socketUrl = useGetSocketUrl();
  const { sendJsonMessage } = useWebSocket(socketUrl, {
    share: true,
  });

  const handleClickAttack = () => {
    if (!targetId) {
      alert('타겟을 선택해주세요.');
      return;
    }

    sendJsonMessage({
      gameId,
      type: 'rob',
      playerId: playerId,
      targetId: targetId,
    });

    resetGoldCard();
    setGameInfo((prev) => {
      return {
        ...prev,
        isArrived: false,
      };
    });
  };

  const handleChooseTarget = (target: string) => {
    if (targetId === target) {
      setTargetId('');
      return;
    }

    setTargetId(target);
  };

  const currentPlayers = players.filter((player) => player.playerId);

  return (
    <Content>
      <GoldCard>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </GoldCard>
      <Instructions>공격할 상대를 선택하세요</Instructions>
      <PlayerToggleWrapper>
        {currentPlayers.map((player) => (
          <PlayerToggle
            key={player.playerId}
            disabled={playerId === player.playerId}
            onClick={() => handleChooseTarget(player.playerId)}
            $isTarget={player.playerId === targetId}
            $order={player.order}
          >
            {player.playerId}
          </PlayerToggle>
        ))}
      </PlayerToggleWrapper>
      <Target>타겟: {targetId}</Target>
      <AttackButton onClick={handleClickAttack}>공격하기</AttackButton>
    </Content>
  );
}

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
`;

const GoldCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  background-color: ${({ theme }) => theme.color.accentGold};
`;

const Instructions = styled.span``;

const Title = styled.span`
  font-size: ${({ theme }) => theme.fontSize.sMedium};
`;

const Description = styled.span``;

const PlayerToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
`;

const PlayerToggle = styled.button<{ $isTarget: boolean; $order: number }>`
  width: 5rem;
  height: 3rem;
  border: ${({ theme, $isTarget }) =>
    $isTarget ? 'none' : `1px solid ${theme.color.neutralBorder}`};
  border-radius: ${({ theme }) => theme.radius.small};
  color: ${({ theme, $isTarget }) =>
    $isTarget ? theme.color.accentText : theme.color.neutralText};
  background-color: ${({ theme, $order, $isTarget }) =>
    $isTarget
      ? theme.color[`player${$order}` as keyof DefaultTheme['color']]
      : 'none'};

  &:disabled {
    display: none;
  }
`;

const Target = styled.span``;

const AttackButton = styled.button`
  width: 7rem;
  height: 3rem;
  border-radius: ${({ theme }) => theme.radius.medium};
  color: ${({ theme }) => theme.color.accentText};
  background-color: ${({ theme }) => theme.color.accentBackground};
`;
