package codesquad.gaemimarble.game.gameStatus.entity;

import java.util.Map;

import codesquad.gaemimarble.game.stock.entity.Theme;
import lombok.Getter;

@Getter
public enum Events {

	EPIDEMIC("역병", "새로운 바이러스의 탄생...", "제약 / 바이오 + 50%, 나머지- 30%",
		Map.of(Theme.PHARMACEUTICAL, 50, Theme.IT, -30, Theme.FOOD, -30,
			Theme.FASHION, -30, Theme.MILITARY, -30, Theme.TRIP, -30, Theme.ELON_MUSK, -30, Theme.CONSTRUCTION, -30)),
	EUREKA("유레카", "초전도체 발견 !", "IT + 50%", Map.of(Theme.IT, 50)),
	WAR("전쟁", "전쟁 발발 !", "군수 + 50%, 여행 -30%", Map.of(Theme.MILITARY, 50, Theme.TRIP, -30)),
	GREAT_BOOM("역대급 불장", "영차 영차 !!", "모든 기업 + 50%", Map.of(Theme.PHARMACEUTICAL, 50, Theme.IT, 50, Theme.FOOD, 50,
		Theme.FASHION, 50, Theme.MILITARY, 50, Theme.TRIP, 50, Theme.ELON_MUSK, 50, Theme.CONSTRUCTION, 50)),
	GREAT_BUST("역대급 물장", "돔황챠 !!", "모든 기업 - 30%", Map.of(
		Theme.PHARMACEUTICAL, -30, Theme.IT, -30, Theme.FOOD, -30,
		Theme.FASHION, -30, Theme.MILITARY, -30, Theme.TRIP, -30, Theme.ELON_MUSK, -30, Theme.CONSTRUCTION, -30)),
	DOGECOIN("도지 화성 갈끄니까", "이 사기꾼 또 뻘글", "일론 머스크 - 20%", Map.of(Theme.ELON_MUSK, -20)),
	AUTONOMOUS_DRIVING("자율 주행 한단계 더", "일론머스크는 천재다", "일론 머스크 + 20%", Map.of(Theme.ELON_MUSK, 20)),
	NATURAL_DISASTER("자연재해", "무친 태풍", "건설 + 30%, 여행 - 20%", Map.of(Theme.CONSTRUCTION, 30, Theme.TRIP, -20)),
	WEATHER_CONTROL("날씨 조타", "여행 가기 딱 좋은 날씨군요", "여행 + 30%, 패션 +20%",
		Map.of(Theme.TRIP, 30, Theme.FASHION, 20)),
	INNOVATIVE_PRODUCT("혁신적인 신제품 발표", "IT 대기업들에서 신제품 발표가 성공적으로 이루어졌다.", "IT 관련주 + 20%"
		, Map.of(Theme.IT, 20)),
	NEW_DRUG_SUCCESS("신약개발 성공", "탈모 치료제가 나왔다고?", "제약/바이오 관련주 +50%",
		Map.of(Theme.PHARMACEUTICAL, 50)),
	INTEREST_RATE_HIKE("금리 인상", "대출 비용 증가, 소비 부담 증가", "모든 주식 - 10%",
		Map.of(Theme.PHARMACEUTICAL, -10, Theme.IT, -10, Theme.FOOD, -10,
			Theme.FASHION, -10, Theme.MILITARY, -10, Theme.TRIP, -10, Theme.ELON_MUSK, -10, Theme.CONSTRUCTION, -10)),
	LOW_INTEREST_POLICY("저금리 정책 발표", "대출 확대, 투자 촉진", "모든 주식 + 20%",
		Map.of(Theme.PHARMACEUTICAL, 20, Theme.IT, 20, Theme.FOOD, 20,
			Theme.FASHION, 20, Theme.MILITARY, 20, Theme.TRIP, 20, Theme.ELON_MUSK, 20, Theme.CONSTRUCTION, 20)),
	ECONOMIC_BOOM("경기 호황", "경제가 성장한다!", "모든 주식 + 30%",
		Map.of(Theme.PHARMACEUTICAL, 30, Theme.IT, 30, Theme.FOOD, 30,
			Theme.FASHION, 30, Theme.MILITARY, 30, Theme.TRIP, 30, Theme.ELON_MUSK, 30, Theme.CONSTRUCTION, 30)),
	LARGE_SCALE_HACKING("대규모 해킹 사건 발생", "개인 정보 해킹 당함, 보안 문제", "IT 주식 - 30%",
		Map.of(Theme.IT, -30)),
	TRAVEL_ALERT_LIFTED("여행 경보 해제", "여행 붐", "여행 + 40%",
		Map.of(Theme.TRIP, 40)),
	CONSUMER_SENTIMENT("소비심리", "패션관련 소비가 증가하고 있다.", "패션 관련주 + 30%",
		Map.of(Theme.FASHION, 30)),
	KOREAN_AIR_STRIKE("대한항공, 하나투어 파업", "20일 동안 대규모 파업", "여행 - 20%",
		Map.of(Theme.TRIP, -20)),
	SUCCESSFUL_MCDONALDS_COLLAB("맥도날드x농심 콜라보!", "신제품 버거 출시", "식품산업 + 30%",
		Map.of(Theme.FOOD, 30));

	private final String title;
	private final String contents;
	private final String impactDescription;
	private final Map<Theme, Integer> impact;

	Events(String title, String contents, String impactDescription, Map<Theme, Integer> impact) {
		this.title = title;
		this.contents = contents;
		this.impactDescription = impactDescription;
		this.impact = impact;
	}
}
