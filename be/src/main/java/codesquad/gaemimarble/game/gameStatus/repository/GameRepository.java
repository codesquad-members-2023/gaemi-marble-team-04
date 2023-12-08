package codesquad.gaemimarble.game.gameStatus.repository;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

import codesquad.gaemimarble.game.gameStatus.entity.GameStatus;
import lombok.Getter;

@Repository
public class GameRepository {
	@Getter
	private final ConcurrentMap<Long, GameStatus> gameStatusMap = new ConcurrentHashMap<>();
	private final AtomicLong gameId = new AtomicLong(1);

	public Long createRoom(GameStatus gameStatus) {
		Long gameRoomId = gameId.getAndAdd(1L);
		gameStatusMap.put(gameRoomId, gameStatus);
		return gameRoomId;
	}

	public GameStatus getGameStatus(Long gameId) {
		return gameStatusMap.get(gameId);
	}
}
