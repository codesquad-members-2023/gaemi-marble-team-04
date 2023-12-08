package codesquad.gaemimarble.game.player.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Repository;

import codesquad.gaemimarble.game.player.entity.Player;
import lombok.Getter;

@Repository
public class PlayerRepository {
	@Getter
	private final ConcurrentMap<Long, List<Player>> playerMap = new ConcurrentHashMap<>();

	public List<Player> enterGame(Long gameId, Player player) {
		List<Player> players = playerMap.get(gameId);
		player.setOrder(players.size() + 1);
		players.add(player);
		return players;
	}

	public void createPlayers(Long gameId) {
		playerMap.put(gameId, new ArrayList<>());
	}

	public List<Player> getAllPlayer(Long gameId) {
		return playerMap.get(gameId);
	}

	public Player getPlayer(Long gameId, String playerId) {
		return getAllPlayer(gameId)
			.stream()
			.filter(p -> p.getPlayerId().equals(playerId))
			.findFirst()
			.orElseThrow(() -> new RuntimeException("해당 플레이어가 존재하지 않습니다"));
	}
}
