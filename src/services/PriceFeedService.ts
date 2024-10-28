import { EventEmitter } from 'events';
import { WebSocket } from 'ws';
import { logger } from '../utils/logger';

interface PriceAlert {
  token: string;
  network: string;
  condition: 'above' | 'below';
  price: number;
  triggered: boolean;
}

export class PriceFeedService extends EventEmitter {
  private ws: WebSocket | null = null;
  private alerts: PriceAlert[] = [];
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  constructor(
    private readonly wsUrl: string,
    private readonly apiKey: string
  ) {
    super();
  }

  async connect(): Promise<void> {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.on('open', () => {
        logger.info('Connected to price feed');
        this.reconnectAttempts = 0;
        this.subscribe();
      });

      this.ws.on('message', (data: string) => {
        try {
          const message = JSON.parse(data);
          this.handlePriceUpdate(message);
        } catch (error) {
          logger.error('Failed to parse price feed message:', error);
        }
      });

      this.ws.on('close', () => {
        logger.warn('Price feed connection closed');
        this.handleReconnect();
      });

      this.ws.on('error', (error) => {
        logger.error('Price feed error:', error);
      });
    } catch (error) {
      logger.error('Failed to connect to price feed:', error);
      throw error;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      
      setTimeout(() => {
        logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        this.connect();
      }, delay);
    } else {
      logger.error('Max reconnection attempts reached');
      this.emit('maxReconnectAttemptsReached');
    }
  }

  private subscribe(): void {
    if (!this.ws) return;

    const message = {
      type: 'subscribe',
      apiKey: this.apiKey,
      tokens: Array.from(new Set(this.alerts.map(alert => alert.token)))
    };

    this.ws.send(JSON.stringify(message));
  }

  private handlePriceUpdate(update: any): void {
    const { token, network, price } = update;

    // Check alerts
    this.alerts
      .filter(alert => !alert.triggered && alert.token === token && alert.network === network)
      .forEach(alert => {
        if (
          (alert.condition === 'above' && price >= alert.price) ||
          (alert.condition === 'below' && price <= alert.price)
        ) {
          alert.triggered = true;
          this.emit('alertTriggered', {
            token,
            network,
            condition: alert.condition,
            targetPrice: alert.price,
            currentPrice: price
          });
        }
      });

    // Emit price update
    this.emit('priceUpdate', { token, network, price });
  }

  addAlert(alert: Omit<PriceAlert, 'triggered'>): void {
    this.alerts.push({ ...alert, triggered: false });
    this.subscribe(); // Resubscribe to include new token if needed
  }

  removeAlert(token: string, network: string, condition: 'above' | 'below', price: number): void {
    this.alerts = this.alerts.filter(
      alert =>
        !(
          alert.token === token &&
          alert.network === network &&
          alert.condition === condition &&
          alert.price === price
        )
    );
  }

  clearAlerts(): void {
    this.alerts = [];
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}