// frontend/src/hooks/useWebSocket.js
import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export const useWebSocket = (url) => {
    const [connected, setConnected] = useState(false);
    const clientRef = useRef(null);

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS(url || process.env.REACT_APP_WS_URL),
            connectHeaders: {},
            debug: (str) => {
                console.log('STOMP: ' + str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log('WebSocket 连接成功');
            setConnected(true);
        };

        client.onDisconnect = () => {
            console.log('WebSocket 连接断开');
            setConnected(false);
        };

        client.onStompError = (frame) => {
            console.error('WebSocket 错误:', frame);
            setConnected(false);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [url]);

    const subscribe = (destination, callback) => {
        if (clientRef.current && connected) {
            return clientRef.current.subscribe(destination, callback);
        }
    };

    const sendMessage = (destination, message) => {
        if (clientRef.current && connected) {
            clientRef.current.publish({
                destination,
                body: JSON.stringify(message)
            });
        }
    };

    return { connected, subscribe, sendMessage };
};