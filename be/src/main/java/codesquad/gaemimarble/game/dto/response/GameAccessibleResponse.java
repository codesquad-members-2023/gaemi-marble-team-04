package codesquad.gaemimarble.game.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class GameAccessibleResponse {
	private final Boolean isPresent;
	private final Boolean isFull;

	@Builder
	private GameAccessibleResponse(Boolean isPresent, Boolean isFull) {
		this.isPresent = isPresent;
		this.isFull = isFull;
	}
}
