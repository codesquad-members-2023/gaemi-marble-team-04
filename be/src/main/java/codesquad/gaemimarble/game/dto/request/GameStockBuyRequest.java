package codesquad.gaemimarble.game.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameStockBuyRequest {
	private Long gameId;
	private String playerId;
	private String stockName;
	private Integer quantity;

	@Builder
	private GameStockBuyRequest(Long gameId, String playerId, String stockName, Integer quantity) {
		this.gameId = gameId;
		this.playerId = playerId;
		this.stockName = stockName;
		this.quantity = quantity;
	}
}
