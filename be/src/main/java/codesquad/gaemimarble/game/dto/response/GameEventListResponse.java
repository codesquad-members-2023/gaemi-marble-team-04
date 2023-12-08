package codesquad.gaemimarble.game.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
public class GameEventListResponse {
	private final int timer;
	private final List<GameEventResponse> events;

	@Builder
	private GameEventListResponse(int timer, List<GameEventResponse> events) {
		this.timer = timer;
		this.events = events;
	}
}
