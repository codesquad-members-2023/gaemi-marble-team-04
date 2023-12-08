package codesquad.gaemimarble.game.stock.entity;

import lombok.Getter;

@Getter
public enum Theme {
	IT("it"),
	MILITARY("military"),
	FOOD("food"),
	ELON_MUSK("elonmusk"),
	FASHION("fashion"),
	TRIP("Trip"),
	PHARMACEUTICAL("pharmaceutical"),
	CONSTRUCTION("construction");

	private final String name;

	Theme(String name) {
		this.name = name;
	}
}
