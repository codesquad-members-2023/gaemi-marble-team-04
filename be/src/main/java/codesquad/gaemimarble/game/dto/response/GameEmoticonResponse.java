package codesquad.gaemimarble.game.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameEmoticonResponse {
	private String playerId;
	private String name;

	@Builder
	public GameEmoticonResponse(String playerId, String name) {
		this.playerId = playerId;
		this.name = name;
	}
}
