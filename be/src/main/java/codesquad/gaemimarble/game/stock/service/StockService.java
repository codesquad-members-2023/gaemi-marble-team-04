package codesquad.gaemimarble.game.stock.service;

import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import codesquad.gaemimarble.exception.PlayTimeException;
import codesquad.gaemimarble.game.dto.GameMapper;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameStockManipulationRequest;
import codesquad.gaemimarble.game.dto.request.GoldCardRequest.GameViciousRumorRequest;
import codesquad.gaemimarble.game.dto.response.generalStatusBoard.GameStatusBoardResponse;
import codesquad.gaemimarble.game.stock.entity.Stock;
import codesquad.gaemimarble.game.stock.entity.Theme;
import codesquad.gaemimarble.game.stock.repository.StockRepository;
import codesquad.gaemimarble.util.Constants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {
	private final StockRepository stockRepository;

	public void changePrice(Long gameId, String stockName, Integer percentage) {
		Stock stock = stockRepository.getAllStocks(gameId).
			stream()
			.filter(s -> s.getName().equals(stockName))
			.findFirst()
			.orElseThrow(() -> new PlayTimeException("존재하지 않는 주식입니다"));
		int changingPrice = stock.getCurrentPrice() + ((stock.getStartPrice() * percentage) / 100);
		if (changingPrice <= 0) {
			stock.setCurrentPrice(0);
			return;
		}
		stock.setCurrentPrice(stock.getCurrentPrice() + ((stock.getStartPrice() * percentage) / 100));
	}

	public Integer buy(Long gameId, String stockName, Integer buyingQuantity, Integer playerCashAsset) {
		Stock stock = stockRepository.getStock(gameId, stockName);
		if (stock.getRemainingStock() < buyingQuantity
			| playerCashAsset < stock.getCurrentPrice() * buyingQuantity) {
			throw new PlayTimeException("구매할 수량이 부족하거나, 플레이어 보유 캐쉬가 부족합니다");
		}
		stock.decrementQuantity(buyingQuantity);
		return stock.getCurrentPrice();
	}

	public Integer sell(Long gameId, String stockName, Integer buyingQuantity) {
		Stock stock = stockRepository.getStock(gameId, stockName);
		stock.incrementQuantity(buyingQuantity);
		return stock.getCurrentPrice();
	}

	public void changePriceByEvent(Long gameId, Map<Theme, Integer> impactMap) {
		List<Stock> stockList = stockRepository.getAllStocks(gameId);
		for (Stock stock : stockList) {
			if (impactMap.containsKey(stock.getTheme())) {
				changePrice(gameId, stock.getName(), impactMap.get(stock.getTheme()));
			} else {
				Random random = new Random();
				changePrice(gameId, stock.getName(),
					random.nextBoolean() ? -Constants.DEFAULT_STOCK_PERCENTAGE : Constants.DEFAULT_STOCK_PERCENTAGE);
			}
		}
	}

	public GameStatusBoardResponse createGameStatusBoardResponse(Long gameId) {
		List<Stock> stockList = stockRepository.getAllStocks(gameId);
		return GameStatusBoardResponse.builder()
			.stockStatusBoard(stockList.stream()
				.map(stock -> GameMapper.INSTANCE.toGameStockStatusResponse(stock, stock.getTheme().getName()))
				.collect(Collectors.toList()))
			.build();
	}

	public void rumorStockPrice(GameViciousRumorRequest gameViciousRumorRequest) {
		changePrice(gameViciousRumorRequest.getGameId(), gameViciousRumorRequest.getStockName(),
			Constants.VICIOUS_RUMOR_STOCK_DROP);
	}

	public void manipulateStockPrice(GameStockManipulationRequest gameStockManipulationRequest) {
		changePrice(gameStockManipulationRequest.getGameId(), gameStockManipulationRequest.getStockName(),
			Constants.STOCK_MANIPULATION_INCREASE);
	}

	public void increaseStockPrice(Long gameId, String shareName) {
		Stock stock = stockRepository.getAllStocks(gameId).stream()
			.filter(s -> s.getName().equals(shareName)).findFirst()
			.orElseThrow(() -> new PlayTimeException("존재하지 않는 주식입니다."));
		if (stock.getWasBought()) {
			changePrice(gameId, shareName, Constants.DEFAULT_STOCK_PERCENTAGE);
		}
	}

	public void createStocks(Long gameId) {
		stockRepository.createStocks(gameId);
	}

	public List<Stock> getMatchingStocks(Long gameId, Set<String> stockNames) {
		return stockRepository.getAllStocks(gameId).stream().filter(s -> stockNames.contains(s.getName())).collect(
			Collectors.toList());
	}
}
