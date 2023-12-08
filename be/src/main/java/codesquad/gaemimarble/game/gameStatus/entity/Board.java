package codesquad.gaemimarble.game.gameStatus.entity;

import java.util.ArrayList;
import java.util.List;

import codesquad.gaemimarble.game.stock.entity.Share;
import lombok.Getter;

@Getter
public class Board {
	private final List<String> board;

	public Board() {
		board = new ArrayList<>();
		board.add("start");
		board.add(Share.CODE_SQUAD.getName());
		board.add(Share.MUSINSA.getName());
		board.add(Share.HANA_TOUR.getName());
		board.add(Share.GS.getName());
		board.add(Share.NONGSHIM.getName());
		board.add("prison");
		board.add(Share.HYUNDAI.getName());
		board.add(Share.HANWHA_DEFENSE.getName());
		board.add("goldCard");
		board.add(Share.KOREAN_AIR.getName());
		board.add(Share.TWITTER.getName());
		board.add("goodNews");
		board.add(Share.SAMSUNG_BIO.getName());
		board.add(Share.GOOGLE.getName());
		board.add("tax");
		board.add(Share.HERMES.getName());
		board.add(Share.MCDONALDS.getName());
		board.add("teleport");
		board.add(Share.TESLA.getName());
		board.add(Share.PFIZER.getName());
		board.add("goldCard");
		board.add(Share.STARK_INDUSTRY.getName());
		board.add(Share.APPLE.getName());
	}
}
