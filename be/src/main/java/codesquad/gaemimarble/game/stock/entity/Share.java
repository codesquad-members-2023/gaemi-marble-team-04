package codesquad.gaemimarble.game.stock.entity;

import lombok.Getter;

@Getter
public enum Share {
	CODE_SQUAD("코드스쿼드", Theme.IT, 400_000),
	MUSINSA("무신사", Theme.FASHION, 500_000),
	HANA_TOUR("하나투어", Theme.TRIP, 600_000),
	GS("GS건설", Theme.CONSTRUCTION, 700_000),
	NONGSHIM("농심", Theme.FOOD, 800_000),
	HYUNDAI("현대건설", Theme.CONSTRUCTION, 900_000),
	HANWHA_DEFENSE("한화디펜스", Theme.MILITARY, 1_000_000),
	KOREAN_AIR("대한항공", Theme.TRIP, 1_100_000),
	TWITTER("트위터", Theme.ELON_MUSK, 1_200_000),
	SAMSUNG_BIO("삼성바이오", Theme.PHARMACEUTICAL, 1_300_000),
	GOOGLE("구글", Theme.IT, 1_400_000),
	HERMES("에르메스", Theme.FASHION, 1_500_000),
	MCDONALDS("맥도날드", Theme.FOOD, 1_600_000),
	TESLA("테슬라", Theme.ELON_MUSK, 1_700_000),
	PFIZER("화이자", Theme.PHARMACEUTICAL, 1_800_000),
	STARK_INDUSTRY("스타크인더스트리", Theme.MILITARY, 1_900_000),
	APPLE("애플", Theme.IT, 2_000_000);

	private final String name;
	private final Theme theme;
	private final Integer startPrice;

	Share(String name, Theme theme, Integer startPrice) {
		this.name = name;
		this.theme = theme;
		this.startPrice = startPrice;
	}
}
