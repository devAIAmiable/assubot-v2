import { Socket, io } from 'socket.io-client';

import config from '../config/env';

// Socket.IO event types
export interface ContractProcessedEvent {
  contractId: string;
  status: 'success' | 'error';
  credits?: number;
  error?: string;
}

export interface CreditUpdateEvent {
  userId: string;
  newBalance: number;
  operation: 'consumed' | 'purchased' | 'refunded';
  amount: number;
}

export interface SocketEventHandlers {
  onContractProcessed?: (data: ContractProcessedEvent) => void;
  onCreditUpdate?: (data: CreditUpdateEvent) => void;
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseReconnectDelay = 1000; // 1 second
  private reconnectTimer: number | null = null;
  private eventHandlers: SocketEventHandlers = {};
  private listenersSetup = false; // Track if listeners have been setup

  constructor() {}

  /**
   * Connect to the Socket.IO server
   */
  public connect(): void {
    if (this.socket?.connected) {
      return;
    }

    if (this.isConnecting) {
      return;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = true;

    try {
      const socketUrl = config.coreApiUrl.replace('/api/v1', '');

      this.socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
        forceNew: false,
        autoConnect: true,
        reconnection: false,
        withCredentials: true,
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      this.isConnecting = false;
      this.handleConnectionError(error as Error);
    }
  }

  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }

    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.listenersSetup = false;
  }

  /**
   * Set event handlers for socket events
   * Note: Only one handler per event type. New handlers replace old ones.
   */
  public setEventHandlers(handlers: SocketEventHandlers): void {
    this.eventHandlers = { ...this.eventHandlers, ...handlers };
  }

  /**
   * Get current event handlers
   */
  public getEventHandlers(): SocketEventHandlers {
    return { ...this.eventHandlers };
  }

  /**
   * Remove all event handlers
   */
  public clearEventHandlers(): void {
    this.eventHandlers = {};
  }

  /**
   * Check if socket is connected
   */
  public isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  /**
   * Get connection status
   */
  public getConnectionStatus(): 'connecting' | 'connected' | 'disconnected' {
    if (this.isConnecting) return 'connecting';
    if (this.socket?.connected) return 'connected';
    return 'disconnected';
  }

  /**
   * Setup socket event listeners
   * This should only be called ONCE per socket instance
   */
  private setupEventListeners(): void {
    if (!this.socket) {
      console.warn('Cannot setup listeners: socket is null');
      return;
    }

    // If listeners are already setup, skip
    if (this.listenersSetup) {
      return;
    }

    // Connection events
    this.socket.on('connect', () => {
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.eventHandlers.onConnect?.();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnecting = false;
      this.listenersSetup = false;
      this.eventHandlers.onDisconnect?.(reason);

      // Attempt to reconnect unless it's a manual disconnect
      if (reason !== 'io client disconnect') {
        this.scheduleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnecting = false;

      if (error.message.includes('Invalid namespace') || error.message.includes('Namespace not found')) {
        console.warn('Socket.IO server not available - real-time features disabled');
        this.maxReconnectAttempts = 0;
      }

      this.handleConnectionError(error);
    });

    this.socket.on('contract_summarized', (data: ContractProcessedEvent) => {
      this.eventHandlers.onContractProcessed?.(data);
    });

    this.socket.on('credit_updated', (data: CreditUpdateEvent) => {
      this.eventHandlers.onCreditUpdate?.(data);
    });

    this.socket.on('error', (error: Error) => {
      console.error('Socket error:', error);
      this.eventHandlers.onError?.(error);
    });

    this.listenersSetup = true;
  }

  /**
   * Handle connection errors and schedule reconnection
   */
  private handleConnectionError(error: Error): void {
    this.eventHandlers.onError?.(error);
    this.scheduleReconnect();
  }

  /**
   * Schedule reconnection with exponential backoff
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached. Stopping reconnection.');
      return;
    }

    const delay = this.baseReconnectDelay * Math.pow(2, this.reconnectAttempts);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  /**
   * Manually trigger reconnection
   */
  public reconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    this.connect();
  }

  /**
   * Emit a custom event to the server
   */
  public emit(event: string, data?: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit event:', event);
    }
  }

  /**
   * Subscribe to a custom event
   */
  public on(event: string, handler: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, handler);
    }
  }

  /**
   * Unsubscribe from a custom event
   */
  public off(event: string, handler?: (data: unknown) => void): void {
    if (this.socket) {
      if (handler) {
        this.socket.off(event, handler);
      } else {
        this.socket.off(event);
      }
    }
  }
}

export const socketService = new SocketService();

export { SocketService };
