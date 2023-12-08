package codesquad.gaemimarble.game.gameStatus.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.stereotype.Service;

import codesquad.gaemimarble.exception.PlayTimeException;
import codesquad.gaemimarble.game.dto.request.GameEventResultRequest;
import codesquad.gaemimarble.game.dto.response.GameEventListResponse;
import codesquad.gaemimarble.game.dto.response.GameEventNameResponse;
import codesquad.gaemimarble.game.dto.response.GameEventResponse;
import codesquad.gaemimarble.game.dto.response.GameGoldCardResponse;
import codesquad.gaemimarble.game.dto.response.GameRoomCreateResponse;
import codesquad.gaemimarble.game.dto.response.GameRoomResponse;
import codesquad.gaemimarble.game.gameStatus.entity.Board;
import codesquad.gaemimarble.game.gameStatus.entity.Events;
import codesquad.gaemimarble.game.gameStatus.entity.GameStatus;
import codesquad.gaemimarble.game.gameStatus.entity.GoldCard;
import codesquad.gaemimarble.game.gameStatus.repository.GameRepository;
import codesquad.gaemimarble.game.stock.entity.Theme;
import codesquad.gaemimarble.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class GameService {
	private final GameRepository gameRepository;

	public GameRoomCreateResponse createRoom() {
		GameStatus gameStatus = GameStatus.builder()
			.roundCount(0)
			.isStarted(false)
			.board(new Board())
			.selectedEvents(new ArrayList<>())
			.sellingTime(Constants.SELLING_TIME)
			.build();
		Long gameRoomId = gameRepository.createRoom(gameStatus);
		return GameRoomCreateResponse.builder().gameId(gameRoomId).build();
	}

	public GameEventListResponse selectEvents(Long gameId) {
		List<Integer> numbers = new ArrayList<>();
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		GameEventListResponse gameEventListResponse = GameEventListResponse.builder().
			timer(gameStatus.getSellingTime()).events(new ArrayList<>()).build();

		for (int i = 1; i <= Events.values().length; i++) {
			numbers.add(i);
		}

		List<Integer> selectedNumbers = new ArrayList<>();
		Random random = new Random();
		for (int i = 0; i < 6; i++) {
			int randomIndex = random.nextInt(numbers.size());
			selectedNumbers.add(numbers.get(randomIndex));
			numbers.remove(randomIndex);
		}
		int count = 1;
		for (Events event : Events.values()) {
			if (selectedNumbers.contains(count++)) {
				gameEventListResponse.getEvents()
					.add(GameEventResponse.builder()
						.title(event.getTitle())
						.content(event.getContents())
						.impact(event.getImpactDescription())
						.build());
				gameStatus.getSelectedEvents().add(event);
			}
		}
		return gameEventListResponse;
	}

	public GameEventNameResponse selectEvent(GameEventResultRequest gameEventResultRequest) {
		int randomIndex = (int)(Math.random() * 6);
		return GameEventNameResponse.builder().name(gameEventResultRequest.getEvents().get(randomIndex)).build();
	}

	public Map<Theme, Integer> proceedEvent(String eventName, Long gameId) {
		Events eventToProceed = null;
		for (Events events : Events.values()) {
			if (events.getTitle().equals(eventName)) {
				eventToProceed = events;
			}
		}
		if (eventToProceed == null) {
			throw new PlayTimeException("이벤트 이름이 맞지 않습니다");
		}
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		gameStatus.incrementRoundCount();
		gameStatus.getSelectedEvents().clear();

		return eventToProceed.getImpact();
	}

	public String getStockName(Long gameId, Integer location) {
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		return gameStatus.getBoard().getBoard().get(location);
	}

	public boolean checkGameOver(Long gameId) {
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		return gameStatus.getRoundCount() > Constants.GAME_OVER_ROUND;
	}

	public void waitToSell(Long gameId) {
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		gameStatus.waitSellingTime();
	}

	public boolean checkSellingTime(Long gameId) {
		return gameRepository.getGameStatus(gameId).getSellingTime() < Constants.SELLING_TIME;
	}

	public GameEventListResponse selectedEvents(Long gameId) {
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		GameEventListResponse gameEventListResponse = GameEventListResponse.builder().
			timer(gameStatus.getSellingTime()).events(new ArrayList<>()).build();
		for (Events event : gameStatus.getSelectedEvents()) {
			gameEventListResponse.getEvents()
				.add(GameEventResponse.builder()
					.title(event.getTitle())
					.content(event.getContents())
					.impact(event.getImpactDescription())
					.build());
		}
		return gameEventListResponse;
	}

	public GameGoldCardResponse selectGoldCard() {
		GoldCard goldCard = GoldCard.getRandomGoldCard();
		return GameGoldCardResponse.builder()
			.cardType(goldCard.getCardType())
			.title(goldCard.getTitle())
			.description(goldCard.getDescription())
			.build();
	}

	public List<GameRoomResponse> getRooms(List<Long> openRoomIds) {
		List<GameRoomResponse> gameRoomResponses = new ArrayList<>();
		openRoomIds.sort((o1, o2) -> (int) (o1 - o2));
		for (Long openRoomId : openRoomIds) {
			GameStatus gameStatus = gameRepository.getGameStatus(openRoomId);
			gameRoomResponses.add(GameRoomResponse.builder()
				.gameId(openRoomId)
				.isPlaying(gameStatus.getIsStarted())
				.playerCount(null)
				.build());
		}
		return gameRoomResponses;
	}

	public void initGame(Long gameId) {
		GameStatus gameStatus = gameRepository.getGameStatus(gameId);
		gameStatus.startGame();
	}
}
