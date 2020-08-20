import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Global, Logger } from '@nestjs/common'
import { AdminNotificationsService } from './modules/admin-notifications/admin-notifications.service'

@Global()
@WebSocketGateway()
export class AppGateway implements OnGatewayInit{
  @WebSocketServer() server: Server;
  public static socket: Socket = null;

  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('msgToClient', payload, true);
  }

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleDisconnect(client: Socket) {
    AppGateway.socket = null
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    AppGateway.socket = client
    this.logger.log(`Client connected: ${client.id}`);
    if (await AdminNotificationsService.findSeen()) this.server.emit('msgToClient', 'Connection Established with Client', true)
    else this.server.emit('msgToClient', 'Connection Established with Client', false)
  }
}
