// wms-backend/src/main/java/com/wms/system/websocket/InventoryWebSocketHandler.java
package com.wms.backend.controller;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class InventoryWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("WebSocket 连接建立: " + session.getId());

        // 发送欢迎消息
        session.sendMessage(new TextMessage("连接成功！"));
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("收到消息: " + message.getPayload());

        // 回显消息给所有连接的客户端
        broadcastMessage("服务器收到: " + message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket 连接关闭: " + session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("WebSocket 传输错误: " + exception.getMessage());
        sessions.remove(session);
    }

    /**
     * 广播消息给所有连接的客户端
     */
    public void broadcastMessage(String message) {
        TextMessage textMessage = new TextMessage(message);
        sessions.forEach(session -> {
            try {
                if (session.isOpen()) {
                    session.sendMessage(textMessage);
                }
            } catch (IOException e) {
                System.err.println("发送消息失败: " + e.getMessage());
                sessions.remove(session);
            }
        });
    }

    /**
     * 发送库存更新通知
     */
    public void sendInventoryUpdate(Object inventoryData) {
        try {
            String jsonMessage = objectMapper.writeValueAsString(inventoryData);
            broadcastMessage(jsonMessage);
        } catch (Exception e) {
            System.err.println("序列化库存数据失败: " + e.getMessage());
        }
    }
}