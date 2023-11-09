package com.demo.websocket.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@Slf4j
public class WebSocketController {

    private final SimpMessageSendingOperations sendingOperations;
//    private final ChatService chatService;

    @MessageMapping("/chat/message")
    public ResponseEntity<Void> enter(ChatMessageReq request) {
        String roomId = request.getRoomId();
        if (ChatMessageReq.MessageType.ENTER.equals(request.getType())) {
            request.setMessage(request.getSenderId() + "님이 입장하셨습니다.");
        } else {
            // 위도, 경도 주고받기
        }

        // topic-1대다, queue-1대1
        sendingOperations.convertAndSend("/queue/chat/room/" + roomId, request);
        return OK(null);
    }
}
