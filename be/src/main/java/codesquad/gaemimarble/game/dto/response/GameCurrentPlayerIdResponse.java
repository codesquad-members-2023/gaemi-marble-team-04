package codesquad.gaemimarble.game.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class GameCurrentPlayerIdResponse {
	private final String playerId;

	@Builder
	public GameCurrentPlayerIdResponse(String playerId) {
		this.playerId = playerId;
	}
}
