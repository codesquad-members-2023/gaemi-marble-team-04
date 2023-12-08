package codesquad.gaemimarble.game.player.entity;

import java.util.concurrent.ConcurrentMap;

import lombok.Builder;
import lombok.Getter;

@Getter
public class Player {
	private String playerId;
	private Integer order;
	private Integer location;
	private ConcurrentMap<String, Integer> myStocks;
	private Integer stockAsset;
	private Integer cashAsset;
	private Integer totalAsset;
	private Boolean isReady;
	private Integer prisonCount;
	// 상태, 황금카드 보류

	@Builder
	private Player(String playerId, Integer order, Integer location, ConcurrentMap<String, Integer> myStocks,
		Integer stockAsset,
		Integer cashAsset, Integer totalAsset, Boolean isReady, Integer prisonCount) {
		this.playerId = playerId;
		this.order = order;
		this.location = location;
		this.myStocks = myStocks;
		this.stockAsset = stockAsset;
		this.cashAsset = cashAsset;
		this.totalAsset = totalAsset;
		this.isReady = isReady;
		this.prisonCount = prisonCount;
	}

	public void setOrder(Integer order) {
		this.order = order;
	}

	public void setLocation(Integer location) {
		this.location = location;
	}

	public void addCashAsset(int cashAsset) {
		this.cashAsset += cashAsset;
		this.totalAsset += cashAsset;
	}

	public void setReady(boolean isReady) {
		this.isReady = isReady;
	}

	public void move(int i) {
		this.location += i;
	}

	public void goToPrison() {
		this.location = 6;
	}

	public void buy(String stockName, Integer stockCurrentPrice, Integer quantity) {
		myStocks.put(stockName, myStocks.getOrDefault(stockName, 0) + quantity);
		cashAsset -= quantity * stockCurrentPrice;
		stockAsset += quantity * stockCurrentPrice;
	}

	public void sellStock(String stockName, Integer stockCurrentPrice, Integer quantity) {
		myStocks.put(stockName, myStocks.get(stockName) - quantity);
		cashAsset += quantity * stockCurrentPrice;
		stockAsset -= quantity * stockCurrentPrice;
	}

	public void updateStockAsset(String stockName, int currentPrice) {
		stockAsset += myStocks.get(stockName) * currentPrice;
		totalAsset = cashAsset + stockAsset;
	}

	public void initStockAsset() {
		stockAsset = 0;
	}

	public void escapePrison(int diceResult) {
		this.prisonCount = 0;
		this.location += diceResult;
	}

	public void increasePrisonCount() {
		this.prisonCount += 1;
	}
}
