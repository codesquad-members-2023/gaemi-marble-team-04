import { BASE_WS_URL } from '@api/fetcher';
import { usePlayerIdValue } from '@store/index';
import { useParams } from 'react-router-dom';

export default function useGetSocketUrl() {
  const { gameId } = useParams();
  const playerId = usePlayerIdValue();

  const socketUrl = `${BASE_WS_URL}/api/games/${gameId}/${playerId}`;
  return socketUrl;
}
