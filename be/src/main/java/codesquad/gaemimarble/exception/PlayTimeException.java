package codesquad.gaemimarble.exception;

import lombok.Getter;

@Getter
public class PlayTimeException extends RuntimeException {

	public PlayTimeException(String message) {
		super(message);
	}
}
