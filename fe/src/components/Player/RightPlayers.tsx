import { rightPlayerOrderList } from '@pages/constants';
import { usePlayersValue } from '@store/reducer';
import { styled } from 'styled-components';
import PlayerCard from './PlayerCard';

export default function RightPlayers() {
  const playersInfo = usePlayersValue();
  const rightPlayerInfo = playersInfo.filter((player) =>
    rightPlayerOrderList.includes(player.order)
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;
