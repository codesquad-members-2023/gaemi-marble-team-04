package codesquad.gaemimarble.game.stock.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Repository;

import codesquad.gaemimarble.exception.PlayTimeException;
import codesquad.gaemimarble.game.stock.entity.Share;
import codesquad.gaemimarble.game.stock.entity.Stock;

@Repository
public class StockRepository {
	private final ConcurrentMap<Long, List<Stock>> stockMap = new ConcurrentHashMap<>();

	public void createStocks(Long gameId) {
		stockMap.put(gameId, new ArrayList<>());
		List<Stock> stocks = stockMap.get(gameId);
		for (Share share : Share.values()) {
			stocks.add(new Stock(share));
		}
	}

	public List<Stock> getAllStocks(Long gameId) {
		return stockMap.get(gameId);
	}

	public Stock getStock(Long gameId, String stockName) {
		return stockMap.get(gameId)
			.stream()
			.filter(s -> s.getName().equals(stockName))
			.findFirst()
			.orElseThrow(() -> new PlayTimeException("존재하지 않는 주식이름입니다"));
	}
}
