import { RIGHT_PLAYER_ORDERS } from '@pages/constants';
import { usePlayersValue } from '@store/reducer';
import { styled } from 'styled-components';
import PlayerCard from './PlayerCard';

export default function RightPlayers() {
  const playersInfo = usePlayersValue();
  const rightPlayerInfo = playersInfo.filter((player) =>
    RIGHT_PLAYER_ORDERS.includes(player.order)
  );
  return (
    <Players>
      {rightPlayerInfo.map((playerInfo) => (
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
