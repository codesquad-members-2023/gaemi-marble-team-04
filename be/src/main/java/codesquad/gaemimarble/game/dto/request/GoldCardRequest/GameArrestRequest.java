package codesquad.gaemimarble.game.dto.request.GoldCardRequest;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameArrestRequest {
	private Long gameId;
	private String playerId;
	private String targetId;

	@Builder
	public GameArrestRequest(Long gameId, String playerId, String targetId) {
		this.playerId = playerId;
		this.gameId = gameId;
		this.targetId = targetId;
	}
}
