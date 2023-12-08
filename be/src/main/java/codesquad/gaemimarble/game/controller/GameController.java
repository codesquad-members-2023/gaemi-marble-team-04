package codesquad.gaemimarble.game.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.socket.WebSocketSession;

import codesquad.gaemimarble.exception.PlayTimeException;
import codesquad.gaemimarble.game.currentPlayer.service.CurrentPlayerService;
import codesquad.gaemimarble.game.dto.ResponseDTO;
import codesquad.gaemimarble.game.dto.request.GameBailRequest;
import codesquad.gaemimarble.game.dto.request.GameCellArrivalRequest;
import codesquad.gaemimarble.game.dto.request.GameEmoticonRequest;
import codesquad.gaemimarble.game.dto.request.GameEndTurnRequest;
import codesquad.gaemimarble.game.dto.request.GameEventRequest;
import codesquad.gaemimarble.game.dto.request.GameEventResultRequest;
import codesquad.gaemimarble.game.dto.request.GamePrisonDiceRequest;
import codesquad.gaemimarble.game.dto.request.GameReadyRequest;
import codesquad.gaemimarble.game.dto.request.GameRollDiceRequest;
import codesquad.gaemimarble.game.dto.request.GameSellStockRequest;
import codesquad.gaemimarble.game.dto.request.GameStartRequest;
import codesquad.gaemimarble.game.dto.request.GameStatusBoardRequest;
import codesquad.gaemimarble.game.dto.request.GameStockBuyRequest;
import codesquad.gaemimarble.game.dto.request.GameTeleportRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameArrestRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameDonationRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameRobRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameStockManipulationRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameViciousRumorRequest;
import codesquad.gaemimarble.game.dto.response.GameAccessibleResponse;
import codesquad.gaemimarble.game.dto.response.GameCellResponse;
import codesquad.gaemimarble.game.dto.response.GameDiceResult;
import codesquad.gaemimarble.game.dto.response.GameEmoticonResponse;
import codesquad.gaemimarble.game.dto.response.GameEventListResponse;
import codesquad.gaemimarble.game.dto.response.GameEventNameResponse;
import codesquad.gaemimarble.game.dto.response.GameEventResponse;
import codesquad.gaemimarble.game.dto.response.GameRoomCreateResponse;
import codesquad.gaemimarble.game.dto.response.GameRoomResponse;
import codesquad.gaemimarble.game.dto.response.GameTeleportResponse;
import codesquad.gaemimarble.game.dto.response.userStatusBoard.GameUserBoardResponse;
import codesquad.gaemimarble.game.gameStatus.entity.TypeConstants;
import codesquad.gaemimarble.game.gameStatus.service.GameService;
import codesquad.gaemimarble.game.player.entity.Player;
import codesquad.gaemimarble.game.player.service.PlayerService;
import codesquad.gaemimarble.game.stock.service.StockService;
import codesquad.gaemimarble.util.Constants;

@RestController
public class GameController {
	private final Map<String, Class<?>> typeMap;
	private final Map<Class<?>, Consumer<Object>> handlers;
	private final GameService gameService;
	private final CurrentPlayerService currentPlayerService;
	private final StockService stockService;
	private final PlayerService playerService;
	private final SocketDataSender socketDataSender;

	public GameController(GameService gameService, CurrentPlayerService currentPlayerService, StockService stockService,
		PlayerService playerService,
		SocketDataSender socketDataSender) {
		this.gameService = gameService;
		this.currentPlayerService = currentPlayerService;
		this.stockService = stockService;
		this.playerService = playerService;
		this.socketDataSender = socketDataSender;
		this.typeMap = new HashMap<>();
		typeMap.put(TypeConstants.READY, GameReadyRequest.class);
		typeMap.put(TypeConstants.START, GameStartRequest.class);
		typeMap.put(TypeConstants.DICE, GameRollDiceRequest.class);
		typeMap.put(TypeConstants.EVENTS, GameEventRequest.class);
		typeMap.put(TypeConstants.EVENTS_RESULT, GameEventResultRequest.class);
		typeMap.put(TypeConstants.BUY, GameStockBuyRequest.class);
		typeMap.put(TypeConstants.SELL, GameSellStockRequest.class);
		typeMap.put(TypeConstants.END_TURN, GameEndTurnRequest.class);
		typeMap.put(TypeConstants.PRISON_DICE, GamePrisonDiceRequest.class);
		typeMap.put(TypeConstants.BAIL, GameBailRequest.class);
		typeMap.put(TypeConstants.TELEPORT, GameTeleportRequest.class);
		typeMap.put(TypeConstants.ROB, GameRobRequest.class);
		typeMap.put(TypeConstants.STATUS_BOARD, GameStatusBoardRequest.class);
		typeMap.put(TypeConstants.CELL, GameCellArrivalRequest.class);
		typeMap.put(TypeConstants.DONATION, GameDonationRequest.class);
		typeMap.put(TypeConstants.VICIOUS_RUMOR, GameViciousRumorRequest.class);
		typeMap.put(TypeConstants.MANIPULATION, GameStockManipulationRequest.class);
		typeMap.put(TypeConstants.ARREST, GameArrestRequest.class);
		typeMap.put(TypeConstants.EMOTICON, GameEmoticonRequest.class);

		this.handlers = new HashMap<>();
		handlers.put(GameReadyRequest.class, req -> sendReadyStatus((GameReadyRequest)req));
		handlers.put(GameStartRequest.class, req -> sendFirstPlayer((GameStartRequest)req));
		handlers.put(GameRollDiceRequest.class, req -> sendDiceResult((GameRollDiceRequest)req));
		handlers.put(GameEventRequest.class, req -> sendRandomEvents((GameEventRequest)req));
		handlers.put(GameEventResultRequest.class, req -> sendEventResult((GameEventResultRequest)req));
		handlers.put(GameStockBuyRequest.class, req -> sendBuyResult((GameStockBuyRequest)req));
		handlers.put(GameSellStockRequest.class, req -> sendSellResult((GameSellStockRequest)req));
		handlers.put(GameEndTurnRequest.class, req -> sendNextPlayer((GameEndTurnRequest)req));
		handlers.put(GamePrisonDiceRequest.class, req -> sendPrisonDiceResult((GamePrisonDiceRequest)req));
		handlers.put(GameBailRequest.class, req -> sendBailResult((GameBailRequest)req));
		handlers.put(GameTeleportRequest.class, req -> sendTeleport((GameTeleportRequest)req));
		handlers.put(GameRobRequest.class, req -> sendRobResult((GameRobRequest)req));
		handlers.put(GameStatusBoardRequest.class, req -> sendStatusBoard((GameStatusBoardRequest)req));
		handlers.put(GameCellArrivalRequest.class, req -> sendCellArrival((GameCellArrivalRequest)req));
		handlers.put(GameDonationRequest.class, req -> sendDonationResult((GameDonationRequest)req));
		handlers.put(GameViciousRumorRequest.class, req -> sendViciousRumorResult((GameViciousRumorRequest)req));
		handlers.put(GameStockManipulationRequest.class,
			req -> sendStockManipulationResult((GameStockManipulationRequest)req));
		handlers.put(GameArrestRequest.class, req -> sendArrestResult((GameArrestRequest)req));
		handlers.put(GameEmoticonRequest.class, req -> sendEmoticon((GameEmoticonRequest)req));
	}

	private void sendEmoticon(GameEmoticonRequest gameEmoticonRequest) {
		socketDataSender.send(gameEmoticonRequest.getGameId(), new ResponseDTO<>(TypeConstants.EMOTICON,
			GameEmoticonResponse.builder().playerId(gameEmoticonRequest.getPlayerId()).name(
				gameEmoticonRequest.getName()).build()));
	}

	private void sendArrestResult(GameArrestRequest gameArrestRequest) {
		socketDataSender.send(gameArrestRequest.getGameId(), new ResponseDTO<>(TypeConstants.TELEPORT,
			playerService.arrest(gameArrestRequest)));
	}

	private void sendStockManipulationResult(GameStockManipulationRequest gameStockManipulationRequest) {
		stockService.manipulateStockPrice(gameStockManipulationRequest);
		playerService.updatePlayersAsset(gameStockManipulationRequest.getGameId());
		sendStatusBoard(GameStatusBoardRequest.builder().gameId(gameStockManipulationRequest.getGameId()).build());
	}

	private void sendViciousRumorResult(GameViciousRumorRequest gameViciousRumorRequest) {
		stockService.rumorStockPrice(gameViciousRumorRequest);
		playerService.updatePlayersAsset(gameViciousRumorRequest.getGameId());
		sendStatusBoard(GameStatusBoardRequest.builder().gameId(gameViciousRumorRequest.getGameId()).build());
	}

	private void sendDonationResult(GameDonationRequest gameDonationRequest) {
		List<Player> players = playerService.donate(gameDonationRequest);
		players.forEach(
			p -> socketDataSender.send(gameDonationRequest.getGameId(),
				new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
					playerService.createUserBoardResponse(p))));
	}

	private void sendRobResult(GameRobRequest gameRobRequest) {
		List<Player> players = playerService.rob(gameRobRequest);
		players.forEach(
			p -> socketDataSender.send(gameRobRequest.getGameId(), new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
				playerService.createUserBoardResponse(p))));
	}

	private void sendNextPlayer(GameEndTurnRequest gameEndTurnRequest) {
		socketDataSender.send(gameEndTurnRequest.getGameId(), new ResponseDTO<>(TypeConstants.END_TURN,
			currentPlayerService.endTurn(gameEndTurnRequest)));
	}

	private void sendSellResult(GameSellStockRequest gameSellStockRequest) {
		socketDataSender.send(gameSellStockRequest.getGameId(), new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
			playerService.sellStock(gameSellStockRequest)));
	}

	private void sendEventResult(GameEventResultRequest gameEventResultRequest) {
		GameEventNameResponse gameEventNameResponse = gameService.selectEvent(gameEventResultRequest);
		stockService.changePriceByEvent(gameEventResultRequest.getGameId(),
			gameService.proceedEvent(gameEventNameResponse.getName(), gameEventResultRequest.getGameId()));
		playerService.updatePlayersAsset(gameEventResultRequest.getGameId());
		socketDataSender.send(gameEventResultRequest.getGameId(), new ResponseDTO<>(TypeConstants.EVENTS_RESULT,
			gameEventNameResponse));
		if (gameService.checkGameOver(gameEventResultRequest.getGameId())) {
			socketDataSender.send(
				gameEventResultRequest.getGameId(), new ResponseDTO<>(TypeConstants.GAME_OVER,
					playerService.createUserRanking(gameEventResultRequest.getGameId())));
		}
	}

	@PostMapping("/api/games")
	public ResponseEntity<GameRoomCreateResponse> createRoom() {
		GameRoomCreateResponse gameRoomCreateResponse = gameService.createRoom();
		stockService.createStocks(gameRoomCreateResponse.getGameId());
		playerService.createPlayers(gameRoomCreateResponse.getGameId());
		socketDataSender.createRoom(gameRoomCreateResponse.getGameId());
		return ResponseEntity.status(HttpStatus.CREATED).body(gameRoomCreateResponse);
	}

	public void enterGame(Long gameId, WebSocketSession session, String playerId) {
		if (socketDataSender.saveSocket(gameId, playerId, session)) {
			if (gameService.checkSellingTime(gameId)) {
				socketDataSender.sendToPlayer(playerId, gameId, new ResponseDTO<>(TypeConstants.EVENTS,
					gameService.selectedEvents(gameId)));
			}
			socketDataSender.sendToPlayer(playerId, gameId, new ResponseDTO<>(TypeConstants.CURRENT_PLAYER,
				currentPlayerService.getCurrentPlayer(gameId)));
			socketDataSender.sendToPlayer(playerId, gameId, new ResponseDTO<>(TypeConstants.LOCATIONS,
				playerService.getLocations(gameId)));
			socketDataSender.sendToPlayer(playerId, gameId,
				new ResponseDTO<>(TypeConstants.ENTER, playerService.reenter(gameId)));
			sendAllUserStatusBoardResponseToPlayer(playerId, gameId);
			socketDataSender.sendToPlayer(playerId, gameId, new ResponseDTO<>(TypeConstants.STATUS_BOARD,
				stockService.createGameStatusBoardResponse(gameId)));
		} else {
			socketDataSender.send(gameId,
				new ResponseDTO<>(TypeConstants.ENTER, playerService.enterGame(gameId, playerId)));
		}
	}

	private void sendStatusBoard(GameStatusBoardRequest gameStatusBoardRequest) {
		socketDataSender.send(gameStatusBoardRequest.getGameId(), new ResponseDTO<>(TypeConstants.STATUS_BOARD,
			stockService.createGameStatusBoardResponse(gameStatusBoardRequest.getGameId())));
		sendAllUserStatusBoardResponse(gameStatusBoardRequest.getGameId());
	}

	private void sendAllUserStatusBoardResponseToPlayer(String playerId, Long gameId) {
		List<GameUserBoardResponse> gameUserBoardResponses = playerService.createUserStatusBoardResponse(
			gameId);
		for (GameUserBoardResponse gameUserBoardResponse : gameUserBoardResponses) {
			socketDataSender.sendToPlayer(playerId, gameId, new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
				gameUserBoardResponse));
		}
	}

	private void sendAllUserStatusBoardResponse(Long gameId) {
		List<GameUserBoardResponse> gameUserBoardResponses = playerService.createUserStatusBoardResponse(
			gameId);
		for (GameUserBoardResponse gameUserBoardResponse : gameUserBoardResponses) {
			socketDataSender.send(gameId, new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
				gameUserBoardResponse));
		}
	}

	@GetMapping("/api/games/rooms")
	public ResponseEntity<List<GameRoomResponse>> getRooms() {
		List<GameRoomResponse> rooms = gameService.getRooms(socketDataSender.openRoomIds());
		return ResponseEntity.ok().body(playerService.setRooms(rooms));
	}

	@GetMapping("/api/games/{gameId}")
	public ResponseEntity<GameAccessibleResponse> checkAccessiblity(@PathVariable Long gameId) {
		return ResponseEntity.ok().body(playerService.checkAccessibility(gameId));
	}

	public Map<String, Class<?>> getTypeMap() {
		return typeMap;
	}

	public void handleRequest(Object request) {
		Consumer<Object> handler = handlers.get(request.getClass());
		if (handler != null) {
			handler.accept(request);
		} else {
			throw new IllegalArgumentException("Unknown request type");
		}
	}

	private void sendReadyStatus(GameReadyRequest gameReadyRequest) {
		socketDataSender.send(gameReadyRequest.getGameId(), new ResponseDTO<>(TypeConstants.READY,
			playerService.readyGame(gameReadyRequest)));
	}

	// 게임 시작
	private void sendFirstPlayer(GameStartRequest gameStartRequest) {
		String playerId = playerService.selectFirstPlayer(gameStartRequest.getGameId());
		currentPlayerService.initCurrentPlayer(gameStartRequest.getGameId(), playerId);
		gameService.initGame(gameStartRequest.getGameId());
		socketDataSender.send(gameStartRequest.getGameId(), new ResponseDTO<>(TypeConstants.START,
			Map.of("playerId", playerId)));
		socketDataSender.send(gameStartRequest.getGameId(), new ResponseDTO<>(TypeConstants.STATUS_BOARD,
			stockService.createGameStatusBoardResponse(gameStartRequest.getGameId())));
		List<GameUserBoardResponse> gameUserBoardResponses = playerService.createUserStatusBoardResponse(
			gameStartRequest.getGameId());
		for (GameUserBoardResponse gameUserBoardResponse : gameUserBoardResponses) {
			socketDataSender.send(gameStartRequest.getGameId(), new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
				gameUserBoardResponse));
		}
	}

	private void sendDiceResult(GameRollDiceRequest gameRollDiceRequest) {
		GameDiceResult gameDiceResult = currentPlayerService.rollDice(gameRollDiceRequest.getGameId(),
			gameRollDiceRequest.getPlayerId());
		socketDataSender.send(gameRollDiceRequest.getGameId(), new ResponseDTO<>(TypeConstants.DICE,
			gameDiceResult));
		if (gameDiceResult.getTripleDouble()) {
			socketDataSender.send(gameRollDiceRequest.getGameId(), new ResponseDTO<>(TypeConstants.TELEPORT,
				GameTeleportResponse.builder().location(6).build()));
		}
	}

	private void sendCellArrival(GameCellArrivalRequest gameCellArrivalRequest) {
		GameCellResponse gameCellResponse = playerService.arriveAtCell(gameCellArrivalRequest.getGameId(),
			gameCellArrivalRequest.getPlayerId());
		socketDataSender.send(gameCellArrivalRequest.getGameId(), new ResponseDTO<>(TypeConstants.CELL,
			gameCellResponse));
		actCell(gameCellArrivalRequest.getGameId(), gameCellResponse);
	}

	private void sendTeleport(GameTeleportRequest gameTeleportRequest) {
		socketDataSender.send(gameTeleportRequest.getGameId(), new ResponseDTO<>(TypeConstants.TELEPORT,
			playerService.teleport(gameTeleportRequest)));
	}

	private void sendRandomEvents(GameEventRequest gameEventRequest) {
		GameEventListResponse eventListResponse = gameService.selectEvents(gameEventRequest.getGameId());
		socketDataSender.send(gameEventRequest.getGameId(), new ResponseDTO<>(TypeConstants.EVENTS,
			eventListResponse));
		gameService.waitToSell(gameEventRequest.getGameId());
		sendEventResult(GameEventResultRequest.builder().gameId(gameEventRequest.getGameId())
			.events(eventListResponse.getEvents().stream().map(GameEventResponse::getTitle).toList()).build());
	}

	private void sendBuyResult(GameStockBuyRequest gameStockBuyRequest) {
		socketDataSender.send(gameStockBuyRequest.getGameId(), new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
			playerService.buyStock(gameStockBuyRequest)));
	}

	public void sendPrisonDiceResult(GamePrisonDiceRequest gamePrisonDiceRequest) {
		Boolean hasPayed = false;
		socketDataSender.send(gamePrisonDiceRequest.getGameId(), new ResponseDTO<>(TypeConstants.PRISON_DICE,
			currentPlayerService.prisonDice(gamePrisonDiceRequest, hasPayed)));
	}

	public void sendBailResult(GameBailRequest gameBailRequest) {
		socketDataSender.send(gameBailRequest.getGameId(), new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
			playerService.payExpense(gameBailRequest.getGameId(), gameBailRequest.getPlayerId(),
				Constants.BAIL_MONEY)));
		Boolean hasPayed = true;
		socketDataSender.send(gameBailRequest.getGameId(), new ResponseDTO<>(TypeConstants.PRISON_DICE,
			currentPlayerService.prisonDice(
				GamePrisonDiceRequest.builder().gameId(gameBailRequest.getGameId()).playerId(
					gameBailRequest.getPlayerId()).build(), hasPayed)));
	}

	private void sendUserStatusBoardResponse(Long gameId, String playerId) {
		socketDataSender.send(gameId, new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
			playerService.createUserStatusBoardResponse(gameId)
				.stream()
				.filter(o -> o.getPlayerId().equals(playerId))
				.findFirst().orElseThrow(() -> new PlayTimeException("잘못된 플레이어 아이디입니다"))));
	}

	private void actCell(Long gameId, GameCellResponse gameCellResponse) {
		switch (gameCellResponse.getLocation()) {
			case 0, 6, 18: // 시작, 감옥, 순간이동
				sendUserStatusBoardResponse(gameId, gameCellResponse.getPlayerId());
				break;
			case 9, 21: // 황금카드
				socketDataSender.send(gameId, new ResponseDTO<>(TypeConstants.GOLD_CARD,
					gameService.selectGoldCard()));
				sendUserStatusBoardResponse(gameId, gameCellResponse.getPlayerId());
				break;
			case 12: // 호재
				socketDataSender.send(gameId, new ResponseDTO<>(TypeConstants.STATUS_BOARD,
					playerService.increasePlayerStockPrice(gameId, gameCellResponse.getPlayerId())));
				sendAllUserStatusBoardResponse(gameId);
				break;
			case 15: // 세금
				socketDataSender.send(gameId, new ResponseDTO<>(TypeConstants.USER_STATUS_BOARD,
					playerService.payExpense(gameId, gameCellResponse.getPlayerId(), 10_000_000)));
				break;
			default: // 기업
				stockService.increaseStockPrice(gameId,
					gameService.getStockName(gameId, gameCellResponse.getLocation()));
				playerService.updatePlayersAsset(gameId);
				socketDataSender.send(gameId,
					new ResponseDTO<>(TypeConstants.STATUS_BOARD, stockService.createGameStatusBoardResponse(gameId)));
				sendAllUserStatusBoardResponse(gameId);
				break;
		}
	}
}
