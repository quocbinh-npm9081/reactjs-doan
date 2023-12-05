// eslint-disable-next-line import/named
import { Message, Stomp } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.js'

// eslint-disable-next-line import/namespace
import { WEBSOCKET_LISTENER } from '@/types/socket/socketEnum'

const url = `${import.meta.env.VITE_WEBSOCKET_URL}`
class WebSocketService {
  private token: string = ''
  private stompClient
  public result

  constructor() {}
  initSocket() {
    if (!this.stompClient) {
      this.stompClient = Stomp.over(() => new SockJS(url))
    }
  }
  updateToken = (token: string) => {
    this.token = token
  }
  onConnected = (
    listeners: { topic: string; listener: WEBSOCKET_LISTENER; callback: (value) => void }[],
  ) => {
    if (this.stompClient) {
      this.stompClient!.connect(
        {},
        () => {
          listeners.forEach(({ topic, callback }) => {
            this.stompClient.subscribe(
              topic,
              (frame: Message) => {
                callback(JSON.parse(frame.body))
              },
              { Authorization: `Bearer ${this.token}` },
            )
          })
        },
        (error) => {
          throw new Error(error)
        },
      )
    }
  }
  unsubscribe(channel: string) {
    if (this.stompClient) {
      this.stompClient.unsubscribe(channel)
    }
  }
  onDisconnect = () => {
    if (this.stompClient) {
      this.stompClient.disconnect()
    }
  }
  isStompConnected() {
    return this.stompClient && this.stompClient.connected
  }
  sendMessage(destination: string, message: Record<string, string>) {
    if (this.stompClient) {
      this.stompClient.publish({ destination, body: JSON.stringify(message) })
    }
  }
}

export default WebSocketService
