import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { confirmMove, puzzleSolved } from '../store/puzzleSlice';

export const useWebSocket = (puzzleId) => {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);
  const reconnectCount = useRef(0);

  useEffect(() => {
    if (!puzzleId || reconnectCount.current >= 5) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 3000,
      onConnect: () => {
        setIsConnected(true);
        reconnectCount.current = 0;
        
        // Listen for moves on this puzzle
        client.subscribe(`/topic/puzzle/${puzzleId}/moves`, (msg) => {
          const moveData = JSON.parse(msg.body);
          dispatch(confirmMove(moveData));
        });
        
        // Listen for puzzle completion
        client.subscribe(`/topic/puzzle/${puzzleId}/solved`, (msg) => {
          const solvedData = JSON.parse(msg.body);
          dispatch(puzzleSolved(solvedData));
        });
      },
      onDisconnect: () => {
        setIsConnected(false);
      },
      onStompError: (error) => {
        console.log('Connection error:', error);
        reconnectCount.current++;
        setIsConnected(false);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [puzzleId, dispatch]);

  const sendMove = (moveData) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: '/app/puzzle/move',
        body: JSON.stringify(moveData),
      });
    }
  };

  return { connected: isConnected, sendMove };
};
