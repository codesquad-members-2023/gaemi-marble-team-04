import { PlayerType } from '@store/reducer/type';
import { styled } from 'styled-components';
import PlayerInfo from './PlayerInfo';
import PlayerStock from './PlayerStock';

type PlayerCardProps = {
  player: PlayerType;
};

export default function PlayerCard({ player }: PlayerCardProps) {
  return (
    <StyledPlayer>
      {player.playerId ? (
        <>
          <PlayerInfo player={player} />
          <PlayerStockList>
            {player.userStatusBoard.stockList.map((stock) => (
              <PlayerStock key={stock.name} stockInfo={stock} />
            ))}
          </PlayerStockList>
        </>
      ) : (
        'empty!' // Todo: 빈 카드 처리
      )}
    </StyledPlayer>
  );
}

const StyledPlayer = styled.div`
  width: 22rem;
  height: 15rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: ${({ theme: { radius } }) => radius.small};
  color: ${({ theme: { color } }) => color.neutralText};
  background-color: ${({ theme: { color } }) => color.neutralBackground};
`;

const PlayerStockList = styled.ul``;
