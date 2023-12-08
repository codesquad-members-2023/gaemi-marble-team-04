package codesquad.gaemimarble.game.gameStatus.entity;

import lombok.Getter;

@Getter
public enum GoldCard {
	ROB("rob", "강탈", "선택한 플레이어에게서 1000만원을 강탈한다."),
	DONATION("donation", "기부", "선택한 플레이어에게 1000만원을 기부한다."),
	VICIOUS_RUMOR("viciousRumor", "악성 루머 양산", "선택한 기업의 주가 -30%"),
	MANIPULATION("manipulation", "주가 조작", "선택한 기업의 주가 + 30%"),
	TELEPORT("teleport", "순간이동", "원하는 칸으로 순간이동"),
	ARREST("arrest", "검찰 조사", "원하는 플레이어를 유치장으로 보낸다.");

	private final String cardType;
	private final String title;
	private final String description;

	GoldCard(String cardType, String title, String description) {
		this.cardType = cardType;
		this.title = title;
		this.description = description;
	}

	public static GoldCard getRandomGoldCard() {
		return GoldCard.values()[(int) (Math.random() * GoldCard.values().length)];
	}
}
