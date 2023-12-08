package codesquad.gaemimarble.game.stock.entity;

import lombok.Builder;
import lombok.Getter;

@Getter
public class Stock {
	private final Theme theme;
	private final String name;
	private final Integer startPrice;
	private Integer currentPrice;
	private Integer remainingStock;
	private Boolean wasBought = false;

	@Builder
	private Stock(Theme theme, String name, Integer startPrice, Integer currentPrice, Integer remainingStock) {
		this.theme = theme;
		this.name = name;
		this.startPrice = startPrice;
		this.currentPrice = currentPrice;
		this.remainingStock = remainingStock;
	}

	public Stock(Share share) {
		this.theme = share.getTheme();
		this.name = share.getName();
		this.startPrice = share.getStartPrice();
		this.currentPrice = share.getStartPrice();
		this.remainingStock = 100;
	}

	public void decrementQuantity(Integer quantity) {
		wasBought = true;
		remainingStock -= quantity;
	}

	public void incrementQuantity(Integer quantity) {
		remainingStock += quantity;
	}

	public void setCurrentPrice(int price) {
		currentPrice = price;
	}
}
