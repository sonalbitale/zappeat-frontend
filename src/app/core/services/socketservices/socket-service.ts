import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

 private client!: Client;

  connect() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8082/ws'),

      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('Token')}`
      },

      onConnect: () => {
        console.log('✅ Connected to WebSocket');

        this.client.subscribe('/topic/orders', (message) => {
          console.log('📦 Order Update:', JSON.parse(message.body));
        });
      },

      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
      }
    });

    this.client.activate();
  }

}
