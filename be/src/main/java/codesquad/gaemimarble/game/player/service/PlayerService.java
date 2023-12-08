package codesquad.gaemimarble.game.player.service;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import codesquad.gaemimarble.exception.PlayTimeException;
import codesquad.gaemimarble.game.dto.GameMapper;
import codesquad.gaemimarble.game.dto.request.GameReadyRequest;
import codesquad.gaemimarble.game.dto.request.GameSellStockRequest;
import codesquad.gaemimarble.game.dto.request.GameStockBuyRequest;
import codesquad.gaemimarble.game.dto.request.GameTeleportRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameArrestRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameDonationRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameRobRequest;
import codesquad.gaemimarble.game.dto.request.StockNameQuantity;
import codesquad.gaemimarble.game.dto.response.GameAccessibleResponse;
import codesquad.gaemimarble.game.dto.response.GameCellResponse;
import codesquad.gaemimarble.game.dto.response.GameEnterResponse;
import codesquad.gaemimarble.game.dto.response.GameLocationResponse;
import codesquad.gaemimarble.game.dto.response.GameReadyResponse;
import codesquad.gaemimarble.game.dto.response.GameRoomResponse;
import codesquad.gaemimarble.game.dto.response.GameTeleportResponse;
import codesquad.gaemimarble.game.dto.response.PlayerAsset;
import codesquad.gaemimarble.game.dto.response.UserRankingResponse;
import codesquad.gaemimarble.game.dto.response.generalStatusBoard.GameStatusBoardResponse;
import codesquad.gaemimarble.game.dto.response.userStatusBoard.GameUserBoardResponse;
import codesquad.gaemimarble.game.player.entity.Player;
import codesquad.gaemimarble.game.player.repository.PlayerRepository;
import codesquad.gaemimarble.game.stock.entity.Stock;
import codesquad.gaemimarble.game.stock.service.StockService;
import codesquad.gaemimarble.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerService {
	private final PlayerRepository playerRepository;
	private final StockService stockService;

	public List<GameEnterResponse> enterGame(Long gameId, String playerId) {
		Player player = init(playerId);
		List<Player> players = playerRepository.enterGame(gameId, player);
		return players.stream()
			.map(p -> GameEnterResponse.of(p.getOrder(), p.getPlayerId(), p.getIsReady()))
			.collect(Collectors.toList());
	}

	private Player init(String playerId) {
		return Player.builder()
			.playerId(playerId)
			.cashAsset(200_000_000)
			.location(0)
			.myStocks(new ConcurrentHashMap<>())
			.stockAsset(0)
			.totalAsset(200_000_000)
			.isReady(false)
			.prisonCount(0)
			.build();
	}

	public String selectFirstPlayer(Long gameId) {
		List<Player> players = playerRepository.getAllPlayer(gameId);
		int randomIndex = (int)(Math.random() * players.size()) + 1;
		Player player = players.get(randomIndex - 1);
		setOrder(player.getOrder(), players);
		return player.getPlayerId();
	}

	public GameReadyResponse readyGame(GameReadyRequest gameReadyRequest) {
		Player player = playerRepository.getPlayer(gameReadyRequest.getGameId(), gameReadyRequest.getPlayerId());
		player.setReady(gameReadyRequest.getIsReady());
		return GameReadyResponse.builder()
			.playerId(player.getPlayerId())
			.isReady(player.getIsReady())
			.build();
	}

	public GameAccessibleResponse checkAccessibility(Long gameId) {
		List<Player> players = playerRepository.getAllPlayer(gameId);
		boolean isPresent = false;
		boolean isFull = false;
		if (players != null) {
			isPresent = true;
			if (players.size() == 4) {
				isFull = true;
			}
		}
		return GameAccessibleResponse.builder().isPresent(isPresent).isFull(isFull).build();
	}

	public GameCellResponse arriveAtCell(Long gameId, String playerId) {
		Player player = playerRepository.getPlayer(gameId, playerId);

		int location = player.getLocation();
		int salary = 0;
		int dividend = 0;
		if (location > 23) {
			salary = 5_000_000;
			dividend = (player.getStockAsset() * 5) / 100;
			dividend = (dividend / 100_000) * 100_000;

			player.setLocation(location % 24);
		}
		player.addCashAsset(salary + dividend);

		return GameCellResponse.builder()
			.playerId(player.getPlayerId())
			.location(player.getLocation())
			.build();
	}

	public GameUserBoardResponse payExpense(Long gameId, String playerId, int expense) {
		Player player = playerRepository.getPlayer(gameId, playerId);
		player.addCashAsset(-expense);
		return createUserBoardResponse(player);
	}

	public void updatePlayersAsset(Long gameId) {
		for (Player player : playerRepository.getAllPlayer(gameId)) {
			player.initStockAsset();
			List<Stock> stockList = stockService.getMatchingStocks(gameId, player.getMyStocks().keySet());
			for (Stock stock : stockList) {
				player.updateStockAsset(stock.getName(), stock.getCurrentPrice());
			}
		}
	}

	public GameUserBoardResponse createUserBoardResponse(Player player) {
		for (String key : player.getMyStocks().keySet()) {
			if (player.getMyStocks().get(key) == 0) {
				player.getMyStocks().remove(key);
			}
		}
		return GameUserBoardResponse.builder()
			.playerId(player.getPlayerId())
			.userStatusBoard(GameMapper.INSTANCE.toGameUserStatusBoardResponse(player, player.getMyStocks()
				.keySet()
				.stream()
				.map(k -> GameMapper.INSTANCE.toStockResponse(k, player.getMyStocks().get(k)))
				.toList()))
			.build();
	}

	public List<GameUserBoardResponse> createUserStatusBoardResponse(Long gameId) {
		return playerRepository.getAllPlayer(gameId)
			.stream()
			.map(this::createUserBoardResponse)
			.toList();
	}

	public List<GameLocationResponse> getLocations(Long gameId) {
		return playerRepository.getAllPlayer(gameId)
			.stream()
			.map(p -> GameLocationResponse.builder()
				.playerId(p.getPlayerId())
				.location(p.getLocation())
				.build())
			.toList();
	}

	public UserRankingResponse createUserRanking(Long gameId) {
		return UserRankingResponse.builder().ranking(playerRepository.getAllPlayer(gameId)
			.stream()
			.sorted(Comparator.comparing(Player::getTotalAsset).reversed())
			.map(p -> PlayerAsset.builder().playerId(p.getPlayerId()).totalAsset(p.getTotalAsset()).build())
			.collect(Collectors.toList())).build();
	}

	public List<Player> rob(GameRobRequest gameRobRequest) {
		Player taker = playerRepository.getPlayer(gameRobRequest.getGameId(), gameRobRequest.getPlayerId());
		taker.addCashAsset(10_000_000);
		Player target = playerRepository.getPlayer(gameRobRequest.getGameId(), gameRobRequest.getTargetId());
		target.addCashAsset(-10_000_000);
		return List.of(taker, target);
	}

	public List<Player> donate(GameDonationRequest gameDonationRequest) {
		Player giver = playerRepository.getPlayer(gameDonationRequest.getGameId(), gameDonationRequest.getPlayerId());
		giver.addCashAsset(-10_000_000);
		Player targetId = playerRepository.getPlayer(gameDonationRequest.getGameId(),
			gameDonationRequest.getTargetId());
		targetId.addCashAsset(10_000_000);
		return List.of(giver, targetId);
	}

	public GameUserBoardResponse buyStock(GameStockBuyRequest gameStockBuyRequest) {
		Player player = playerRepository.getPlayer(gameStockBuyRequest.getGameId(), gameStockBuyRequest.getPlayerId());
		Integer stockCurrentPrice = stockService.buy(gameStockBuyRequest.getGameId(),
			gameStockBuyRequest.getStockName(),
			gameStockBuyRequest.getQuantity(), player.getCashAsset());
		player.buy(gameStockBuyRequest.getStockName(), stockCurrentPrice, gameStockBuyRequest.getQuantity());
		return createUserBoardResponse(player);
	}

	public GameUserBoardResponse sellStock(GameSellStockRequest gameSellStockRequest) {
		Player player = playerRepository.getPlayer(gameSellStockRequest.getGameId(),
			gameSellStockRequest.getPlayerId());

		Map<String, Integer> sellingStockInfoMap = new HashMap<>();
		for (StockNameQuantity stock : gameSellStockRequest.getStockList()) {
			sellingStockInfoMap.put(stock.getName(), stock.getQuantity());
		}
		for (String stockName : sellingStockInfoMap.keySet()) {
			if (player.getMyStocks().get(stockName) < sellingStockInfoMap.get(stockName)) {
				throw new PlayTimeException("플레이어가 보유한 주식보다 더 많이 팔수는 없습니다");
			}
		}

		for (String stockName : sellingStockInfoMap.keySet()) {
			int currentPrice = stockService.sell(gameSellStockRequest.getGameId(), stockName,
				sellingStockInfoMap.get(stockName));
			player.sellStock(stockName, currentPrice, sellingStockInfoMap.get(stockName));
		}
		return createUserBoardResponse(player);

	}

	private void setOrder(Integer firstOrder, List<Player> players) {
		for (int i = 0; i < players.size(); i++) {
			players.get(i).setOrder(((i + players.size() - firstOrder + 1) % players.size()) + 1);
			log.info("설정된 오더 (아이디 + 오더)" + players.get(i).getPlayerId() + "/" + players.get(i).getOrder());
		}
	}

	public List<GameEnterResponse> reenter(Long gameId) {
		AtomicInteger order = new AtomicInteger(1);
		return playerRepository.getAllPlayer(gameId)
			.stream()
			.map(p -> GameEnterResponse.of(order.getAndIncrement(), p.getPlayerId(), p.getIsReady()))
			.toList();
	}

	public GameStatusBoardResponse increasePlayerStockPrice(Long gameId, String playerId) {
		Player player = playerRepository.getPlayer(gameId, playerId);
		player.getMyStocks()
			.keySet()
			.forEach(key -> stockService.changePrice(gameId, key, Constants.DEFAULT_STOCK_PERCENTAGE));
		updatePlayersAsset(gameId);
		return stockService.createGameStatusBoardResponse(gameId);
	}

	public boolean isOnTelportOrPrisonCell(Long gameId, String playerId) {
		Integer location = playerRepository.getPlayer(gameId, playerId).getLocation();
		return !(location == Constants.TELEPORT_LOCATION || location == Constants.PRISON_LOCATION);
	}

	public Player getNextPlayer(Long gameId, Integer currentPlayerOrder) {
		List<Player> players = playerRepository.getAllPlayer(gameId);
		if (currentPlayerOrder != players.size()) {
			for (Player player : players) {
				if (player.getOrder() == currentPlayerOrder + 1) {
					return player;
				}
			}
		}
		return null;
	}

	public Player getFirstPlayer(Long gameId) {
		for (Player player : playerRepository.getAllPlayer(gameId)) {
			if (player.getOrder() == 1) {
				return player;
			}
		}
		throw new PlayTimeException("순서가 1인 플레이어가 없습니다.");
	}

	public void escapePrison(Long gameId, String playerId, int diceResult) {
		Player player = playerRepository.getPlayer(gameId, playerId);
		player.escapePrison(diceResult);
	}

	public boolean canEscape(Long gameId, String playerId) {
		Player player = playerRepository.getPlayer(gameId, playerId);
		player.increasePrisonCount();
		return player.getPrisonCount() == 3;
	}

	public GameTeleportResponse teleport(GameTeleportRequest gameTeleportRequest) {
		Player player = playerRepository.getPlayer(gameTeleportRequest.getGameId(), gameTeleportRequest.getPlayerId());
		if (gameTeleportRequest.getLocation().equals(player.getLocation())
			&& player.getLocation() == Constants.TELEPORT_LOCATION) {
			throw new PlayTimeException("순간이동 칸으로 이동 할 수 없습니다");
		}
		player.setLocation(
			gameTeleportRequest.getLocation() > player.getLocation() ? gameTeleportRequest.getLocation() :
				gameTeleportRequest.getLocation() + 24);

		return GameTeleportResponse.builder()
			.playerId(player.getPlayerId())
			.location(gameTeleportRequest.getLocation())
			.build();
	}

	public GameTeleportResponse arrest(GameArrestRequest gameArrestRequest) {
		Player player = playerRepository.getPlayer(gameArrestRequest.getGameId(), gameArrestRequest.getTargetId());
		player.goToPrison();
		return GameTeleportResponse.builder()
			.playerId(player.getPlayerId())
			.location(player.getLocation())
			.build();
	}

	public void goToPrison(Long gameId, String playerId) {
		Player player = playerRepository.getPlayer(gameId, playerId);
		player.goToPrison();
	}

	public void move(Long gameId, String playerId, int diceResult) {
		Player player = playerRepository.getPlayer(gameId, playerId);
		player.move(diceResult);
	}

	public void createPlayers(Long gameId) {
		playerRepository.createPlayers(gameId);
	}

	public List<GameRoomResponse> setRooms(List<GameRoomResponse> rooms) {
		ConcurrentMap<Long, List<Player>> playerMap = playerRepository.getPlayerMap();
		for (GameRoomResponse room : rooms) {
			room.setPlayerCount(playerMap.get(room.getGameId()).size());
		}
		rooms.sort(Comparator.comparing(GameRoomResponse::getIsPlaying).reversed());
		return rooms;
	}
}
