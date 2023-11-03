import { LEFT_PLAYER_ORDERS } from '@pages/constants';
import { usePlayersValue } from '@store/reducer';
import { styled } from 'styled-components';
import PlayerCard from './PlayerCard';

export default function LeftPlayers() {
  const playersInfo = usePlayersValue();
  const leftPlayersInfo = playersInfo.filter((player) =>
    LEFT_PLAYER_ORDERS.includes(player.order)
  );

  return (
    <Players>
      {leftPlayersInfo.map((playerInfo) => (
        <PlayerCard key={playerInfo.order} player={playerInfo} />
      ))}
    </Players>
  );
}

const Players = styled.div`
  min-width: 22rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  align-items: center;
`;
