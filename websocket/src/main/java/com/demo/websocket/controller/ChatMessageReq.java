package com.demo.websocket.controller;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageReq {

    public enum MessageType {
        ENTER, TALK
    }

    private MessageType type;
    private String nickName;
    // 보내는 사람 : 사용자 아이디
    private String senderId;
    // 내용
    private String message;
    private String roomId;
    private Double latitude;
    private Double longitude;


}
