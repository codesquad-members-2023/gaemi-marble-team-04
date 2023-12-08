package codesquad.gaemimarble.game.gameStatus.entity;

import java.util.List;
import java.util.concurrent.TimeUnit;

import codesquad.gaemimarble.util.Constants;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

@Getter
@Slf4j
public class GameStatus {
	private Boolean isStarted;
	private final Board board;
	private final List<Events> selectedEvents;
	private Integer roundCount;
	private Integer sellingTime;

	@Builder
	private GameStatus(Boolean isStarted, Board board, Integer roundCount, List<Events> selectedEvents,
		Integer sellingTime) {
		this.isStarted = isStarted;
		this.board = board;
		this.roundCount = roundCount;
		this.selectedEvents = selectedEvents;
		this.sellingTime = sellingTime;
	}

	public void waitSellingTime() {
		int time = sellingTime + 1;
		for (int i = 0; i < time; i++) {
			try {
				TimeUnit.SECONDS.sleep(1);
				this.sellingTime--;
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		sellingTime = Constants.SELLING_TIME;
	}

	public void incrementRoundCount() {
		roundCount++;
	}

	public void startGame() {
		this.isStarted = true;
	}
}
