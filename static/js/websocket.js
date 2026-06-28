// WebSocket manager for real-time updates
class WebSocketManager {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.reconnectDelay = 3000;
        this.handlers = new Map();
        this.connect();
    }
    
    connect() {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
            console.log('WebSocket connected');
            this.emit('connected');
        };
        
        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.emit('message', data);
            } catch (e) {
                console.error('Error parsing WebSocket message:', e);
            }
        };
        
        this.socket.onclose = () => {
            console.log('WebSocket disconnected');
            this.emit('disconnected');
            setTimeout(() => this.connect(), this.reconnectDelay);
        };
        
        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.emit('error', error);
        };
    }
    
    on(event, handler) {
        if (!this.handlers.has(event)) {
            this.handlers.set(event, []);
        }
        this.handlers.get(event).push(handler);
    }
    
    emit(event, data) {
        const handlers = this.handlers.get(event) || [];
        handlers.forEach(handler => handler(data));
    }
    
    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }
}

export default WebSocketManager;