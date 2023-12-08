package codesquad.gaemimarble.game.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameStatusBoardRequest {
	private Long gameId;

	@Builder
	public GameStatusBoardRequest(Long gameId) {
		this.gameId = gameId;
	}
}
