package codesquad.gaemimarble.game.currentPlayer.repository;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Repository;

import codesquad.gaemimarble.game.currentPlayer.entity.CurrentPlayer;

@Repository
public class CurrentPlayerRepository {
	private final ConcurrentMap<Long, CurrentPlayer> currentPlayerMap = new ConcurrentHashMap<>();

	public CurrentPlayer getCurrentPlayer(Long gameId) {
		return currentPlayerMap.get(gameId);
	}

	public void createCurrentPlayer(Long gameId, String playerId) {
		currentPlayerMap.put(gameId, CurrentPlayer.builder()
			.playerId(playerId)
			.order(1)
			.build());
	}
}
