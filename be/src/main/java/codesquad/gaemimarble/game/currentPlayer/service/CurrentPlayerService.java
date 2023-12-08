package codesquad.gaemimarble.game.currentPlayer.service;

import org.springframework.stereotype.Service;

import codesquad.gaemimarble.exception.PlayTimeException;
import codesquad.gaemimarble.game.currentPlayer.entity.CurrentPlayer;
import codesquad.gaemimarble.game.currentPlayer.repository.CurrentPlayerRepository;
import codesquad.gaemimarble.game.dto.request.GameEndTurnRequest;
import codesquad.gaemimarble.game.dto.request.GamePrisonDiceRequest;
import codesquad.gaemimarble.game.dto.response.GameCurrentPlayerIdResponse;
import codesquad.gaemimarble.game.dto.response.GameDiceResult;
import codesquad.gaemimarble.game.dto.response.GameEndTurnResponse;
import codesquad.gaemimarble.game.dto.response.GamePrisonDiceResponse;
import codesquad.gaemimarble.game.player.entity.Player;
import codesquad.gaemimarble.game.player.service.PlayerService;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentPlayerService {
	private final CurrentPlayerRepository currentPlayerRepository;
	private final PlayerService playerService;

	public void initCurrentPlayer(Long gameId, String playerId) {
		currentPlayerRepository.createCurrentPlayer(gameId, playerId);
	}

	public GameCurrentPlayerIdResponse getCurrentPlayer(Long gameId) {
		return GameCurrentPlayerIdResponse.builder()
			.playerId(currentPlayerRepository.getCurrentPlayer(gameId).getPlayerId())
			.build();
	}

	public GameEndTurnResponse endTurn(GameEndTurnRequest gameEndTurnRequest) {
		CurrentPlayer currentPlayer = currentPlayerRepository.getCurrentPlayer(gameEndTurnRequest.getGameId());
		currentPlayer.resetMove();
		if (currentPlayer.getRolledDouble()) {
			currentPlayer.initRolledDouble();
			if (playerService.isOnTelportOrPrisonCell(gameEndTurnRequest.getGameId(), currentPlayer.getPlayerId())) {
				return GameEndTurnResponse.builder().nextPlayerId(currentPlayer.getPlayerId()).build();
			}
		}
		Player player = playerService.getNextPlayer(gameEndTurnRequest.getGameId(), currentPlayer.getOrder());
		if (player != null) {
			currentPlayer.update(player);
			return GameEndTurnResponse.builder().nextPlayerId(player.getPlayerId()).build();
		}
		currentPlayer.update(playerService.getFirstPlayer(gameEndTurnRequest.getGameId()));
		return GameEndTurnResponse.builder().nextPlayerId(null).build();
	}

	public GamePrisonDiceResponse prisonDice(GamePrisonDiceRequest gamePrisonDiceRequest, Boolean hasPayed) {
		CurrentPlayer currentPlayer = currentPlayerRepository.getCurrentPlayer(gamePrisonDiceRequest.getGameId());
		int dice1 = (int)(Math.random() * 6) + 1;
		int dice2 = (int)(Math.random() * 6) + 1;
		boolean hasEscaped = false;
		if (playerService.canEscape(gamePrisonDiceRequest.getGameId(), gamePrisonDiceRequest.getPlayerId())
			|| hasPayed) {
			playerService.escapePrison(gamePrisonDiceRequest.getGameId(), gamePrisonDiceRequest.getPlayerId(),
				dice1 + dice2);
			if (dice1 == dice2) {
				currentPlayer.increaseDoubleCount();
			}
			currentPlayer.move();
			return GamePrisonDiceResponse.builder()
				.playerId(currentPlayer.getPlayerId())
				.dice1(dice1)
				.dice2(dice2)
				.hasEscaped(true)
				.build();
		}
		if (dice1 == dice2) {
			playerService.escapePrison(gamePrisonDiceRequest.getGameId(), gamePrisonDiceRequest.getPlayerId(),
				dice1 + dice2);
			currentPlayer.move();
			hasEscaped = true;
		}
		return GamePrisonDiceResponse.builder()
			.playerId(currentPlayer.getPlayerId())
			.dice1(dice1)
			.dice2(dice2)
			.hasEscaped(hasEscaped)
			.build();
	}

	public GameDiceResult rollDice(Long gameId, String playerId) {
		CurrentPlayer currentPlayer = currentPlayerRepository.getCurrentPlayer(gameId);
		if (currentPlayer.getHasMoved()) {
			throw new PlayTimeException("주사위를 이미 굴렸습니다.");
		}
		int dice1 = (int)(Math.random() * 6) + 1;
		int dice2 = (int)(Math.random() * 6) + 1;

		if (dice1 == dice2) {
			int countDouble = currentPlayer.increaseDoubleCount();

			if (countDouble == 3) {
				playerService.goToPrison(gameId, playerId);
				return new GameDiceResult(true, dice1, dice2);
			}
		}
		playerService.move(gameId, playerId, dice1 + dice2);
		currentPlayer.move();
		return new GameDiceResult(false, dice1, dice2);
	}
}
