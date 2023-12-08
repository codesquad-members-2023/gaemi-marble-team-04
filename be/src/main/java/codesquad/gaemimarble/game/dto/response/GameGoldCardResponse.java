package codesquad.gaemimarble.game.dto.response;

import lombok.Builder;
import lombok.Getter;

@Getter
public class GameGoldCardResponse {
	private String cardType;
	private String title;
	private String description;

	@Builder
	private GameGoldCardResponse(String cardType, String title, String description) {
		this.cardType = cardType;
		this.title = title;
		this.description = description;
	}
}
