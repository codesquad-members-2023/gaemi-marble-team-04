package codesquad.gaemimarble.game.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.databind.ObjectMapper;

import codesquad.gaemimarble.exception.SocketException;
import codesquad.gaemimarble.game.dto.ResponseDTO;
import codesquad.gaemimarble.game.dto.SocketErrorResponse;
import codesquad.gaemimarble.game.gameStatus.entity.TypeConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class SocketDataSender {
	private final ConcurrentMap<Long, ConcurrentMap<String, WebSocketSession>> gameSocketMap = new ConcurrentHashMap<>();
	private final ObjectMapper objectMapper;

	public void createRoom(Long gameRoomId) {
		gameSocketMap.put(gameRoomId, new ConcurrentHashMap<>());
	}

	public boolean saveSocket(Long gameId, String playerId, WebSocketSession session) {
		ConcurrentMap<String, WebSocketSession> socketMap = gameSocketMap.get(gameId);
		if (socketMap.containsKey(playerId)) {
			socketMap.put(playerId, session);
			return true;
		}

		if (socketMap.values().size() >= 4) {
			throw new SocketException("인원이 가득 찼습니다.", playerId, gameId, session);
		}
		socketMap.put(playerId, session);
		return false;
	}

	public <T> void send(Long gameId, T object) {
		for (WebSocketSession session : gameSocketMap.get(gameId).values()) {
			try {
				session.sendMessage(new TextMessage(objectMapper.writeValueAsString(object)));
			} catch (IOException e) {
				log.error(e.getMessage(), e);
			}
		}
		System.out.println("전송 완료");
	}

	public <T> void sendToPlayer(String playerId, Long gameId, T object) {
		try {
			gameSocketMap.get(gameId)
				.get(playerId)
				.sendMessage(new TextMessage(objectMapper.writeValueAsString(object)));
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}
		System.out.println("전송 완료");
	}

	public void sendErrorMessage(WebSocketSession session, String message) {
		try {
			session.sendMessage(new TextMessage(objectMapper.writeValueAsString(
				new ResponseDTO<>(TypeConstants.ERROR, new SocketErrorResponse(message)))));
		} catch (IOException e) {
			log.error(e.getMessage(), e);
		}
	}

	public boolean isGameSessionActive(Long gameId) {
		ConcurrentMap<String, WebSocketSession> sessions = gameSocketMap.get(gameId);
		if (sessions == null || sessions.isEmpty()) {
			return false; // 게임 ID에 대한 세션이 없거나, 세션 목록이 비어있으면 비활성 상태로 간주
		}

		for (WebSocketSession session : sessions.values()) {
			if (session.isOpen()) {
				return true; // 하나라도 열린 세션이 있으면 활성 상태로 간주
			}
		}

		return false; // 모든 세션이 닫혔으면 비활성 상태로 간주
	}

	public List<Long> openRoomIds() {
		List<Long> openRoomIds = new ArrayList<>();
		for (Long gameId : gameSocketMap.keySet()) {
			if (isGameSessionActive(gameId)) { // 해당 게임방에 활성 세션이 있는 경우
				openRoomIds.add(gameId); // 리스트에 게임방 ID 추가
			} else {
				gameSocketMap.remove(gameId);
			}
		}
		return openRoomIds; // 활성 게임방의 ID 리스트 반환
	}
}
