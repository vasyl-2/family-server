import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';


@WebSocketGateway({
  namespace: 'family-gateway',
  path: '/services/',
  allowUpgrade: true,
})
@Injectable()
export class FamilyGatewayService implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect, OnModuleDestroy {

  @WebSocketServer() server: Server;

  afterInit(): void {
    this.server.on('connection', (socket: any) => {
      console.log('Connection connected', { socketId: socket.id });

      try {
        socket.join('test')
      } catch (e) {
        console.error('socket error', e);
      }
    });

  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('Connection connected', client?.id);
  }

  handleDisconnect(client: any): any {
    console.log('Connection disconnected', client);
  }

  onModuleDestroy(): any {
    this.server.disconnectSockets();
  }

}
