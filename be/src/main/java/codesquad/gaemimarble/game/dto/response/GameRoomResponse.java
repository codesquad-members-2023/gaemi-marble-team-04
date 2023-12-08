package codesquad.gaemimarble.game.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GameRoomResponse {
	private Long gameId;
	private Boolean isPlaying;
	private Integer playerCount;

	@Builder
	public GameRoomResponse(Long gameId, Boolean isPlaying, Integer playerCount) {
		this.gameId = gameId;
		this.isPlaying = isPlaying;
		this.playerCount = playerCount;
	}

	public void setPlayerCount(Integer playerCount) {
		this.playerCount = playerCount;
	}
}
