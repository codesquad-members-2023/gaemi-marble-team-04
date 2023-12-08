package codesquad.gaemimarble.game.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class GameLocationResponse {
	private final String playerId;
	private final Integer location;

	@Builder
	GameLocationResponse(String playerId, Integer location) {
		this.playerId = playerId;
		this.location = location;
	}
}
