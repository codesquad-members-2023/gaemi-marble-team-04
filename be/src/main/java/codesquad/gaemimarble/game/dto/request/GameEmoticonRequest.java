package codesquad.gaemimarble.game.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameEmoticonRequest {
	private Long gameId;
	private String playerId;
	private String name;

	public GameEmoticonRequest(Long gameId, String playerId, String name) {
		this.gameId = gameId;
		this.playerId = playerId;
		this.name = name;
	}
}
