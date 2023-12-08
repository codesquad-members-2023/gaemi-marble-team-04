package codesquad.gaemimarble.game.dto.request.GoldCardRequest;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameViciousRumorRequest {
	private Long gameId;
	private String stockName;

	@Builder
	private GameViciousRumorRequest(Long gameId, String stockName) {
		this.gameId = gameId;
		this.stockName = stockName;
	}
}
