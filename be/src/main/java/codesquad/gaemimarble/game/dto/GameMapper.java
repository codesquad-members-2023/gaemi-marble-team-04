package codesquad.gaemimarble.game.dto;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import codesquad.gaemimarble.game.dto.response.generalStatusBoard.GameStockStatusResponse;
import codesquad.gaemimarble.game.dto.response.userStatusBoard.GameUserStatusBoardResponse;
import codesquad.gaemimarble.game.dto.response.userStatusBoard.StockResponse;
import codesquad.gaemimarble.game.player.entity.Player;
import codesquad.gaemimarble.game.stock.entity.Stock;

@Mapper
public interface GameMapper {
	GameMapper INSTANCE = Mappers.getMapper(GameMapper.class);

	@Mapping(target = "quantity", source = "stock.remainingStock")
	@Mapping(target = "price", source = "stock.currentPrice")
	@Mapping(target = "theme", source = "themeName")
	GameStockStatusResponse toGameStockStatusResponse(Stock stock, String themeName);

	@Mapping(target = "stockList", source = "stockList")
	GameUserStatusBoardResponse toGameUserStatusBoardResponse(Player player, List<StockResponse> stockList);

	StockResponse toStockResponse(String name, Integer quantity);
}
