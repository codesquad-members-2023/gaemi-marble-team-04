package codesquad.gaemimarble.game.dto.request.GoldCardRequest;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameRobRequest {
	private Long gameId;
	private String playerId;
	private String targetId;

	@Builder
	private GameRobRequest(Long gameId, String playerId, String targetId) {
		this.gameId = gameId;
		this.playerId = playerId;
		this.targetId = targetId;
	}
}
