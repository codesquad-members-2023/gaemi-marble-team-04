package codesquad.gaemimarble.exception;

import org.springframework.web.socket.WebSocketSession;

import lombok.Builder;
import lombok.Getter;

@Getter
public class SocketException extends RuntimeException{
	private final String playerId;
	private final Long gameId;
	private final WebSocketSession session;

	@Builder
	public SocketException(String message, String playerId, Long gameId, WebSocketSession session) {
		super(message);
		this.playerId = playerId;
		this.gameId = gameId;
		this.session = session;
	}
}
