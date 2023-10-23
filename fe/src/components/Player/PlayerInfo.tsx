import { Icon } from '@components/icon/Icon';
import { antList } from '@pages/constants';
import { PlayerType } from '@store/reducer/type';
import { styled } from 'styled-components';

type PlayerInfoProps = {
  player: PlayerType;
};

export default function PlayerInfo({ player }: PlayerInfoProps) {
  const antName = antList.find((ant) => ant.order === player?.order)!.antName;

  return (
    <UserInfo>
      <IconContainer>
        <Icon name={antName} size="8rem" />
      </IconContainer>
      <PlayerInfoContainer>
        <PlayerId>{player.playerId}</PlayerId>
        <PlayerProperty>
          <PropertyText>
            보유 현금: {player.userStatusBoard.cashAsset}원
          </PropertyText>
          <PropertyText>
            주식 가치: {player.userStatusBoard.stockAsset}원
          </PropertyText>
          <PropertyText>
            총 자산: {player.userStatusBoard.totalAsset}원
          </PropertyText>
        </PlayerProperty>
      </PlayerInfoContainer>
    </UserInfo>
  );
}

const UserInfo = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconContainer = styled.div`
  width: 8rem;
  height: 10rem;
  display: flex;
  align-items: center;
  border-radius: ${({ theme: { radius } }) => radius.small};
  background-color: ${({ theme: { color } }) => color.systemBackground};
`;

const PlayerInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const PlayerId = styled.span`
  font-size: ${({ theme: { fontSize } }) => fontSize.sMedium};
`;

const PlayerProperty = styled.div`
  width: 12.5rem;
  height: 7rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem 0 0.5rem 0.2rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  font-size: ${({ theme: { fontSize } }) => fontSize.xSmall};
  color: ${({ theme: { color } }) => color.accentText};
  background-color: ${({ theme: { color } }) => color.accentSecondary};
`;

const PropertyText = styled.span`
  display: block;
`;
