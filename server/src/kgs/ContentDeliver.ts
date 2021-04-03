import EventEmitter from 'events';

type deliveryId = number;

export default class ContentDeliver<key, value> {
  private readonly container = new Map<key, value>();

  private readonly orders = new Map<deliveryId, key>();

  // eslint, why you do that? 😡
  // eslint-disable-next-line no-unused-vars, func-call-spacing, no-spaced-func
  private readonly listeners = new Map<deliveryId, (orderKey: key) => void>();

  private lastDeliveryId: deliveryId = -1;

  private emitter = new EventEmitter();

  constructor() {
    this.emitter.setMaxListeners(1000);
  }

  /**
   * Get the orderId
   * @param orderKey
   */
  public order(orderKey: key): deliveryId {
    this.lastDeliveryId += 1;
    this.orders.set(this.lastDeliveryId, orderKey);
    return this.lastDeliveryId;
  }

  /**
   * Call the provided callback when the provided id is delivered
   * @param id
   * @param callback
   */
  // eslint-disable-next-line no-unused-vars
  public wait(id: deliveryId, callback: (orderKey: key) => void) {
    this.emitter.on('delivery', callback);
    this.listeners.set(id, callback);
  }

  /**
   * Set the provided content for the provided id
   * @param id
   * @param content
   */
  public deliver(orderKey: key, content: any) {
    this.container.set(orderKey, content);
    this.emitter.emit('delivery', orderKey);
  }

  /**
   * Get content from the provided orderId and stop listening
   * @param orderId
   */
  public receive(orderId: deliveryId): value | undefined {
    const requestedKey = this.orders.get(orderId);
    let content: value | undefined;
    if (requestedKey) {
      content = this.container.get(requestedKey);
    }
    const listener = this.listeners.get(orderId);
    if (listener) {
      this.emitter.removeListener('delivery', listener);
    }
    return content;
  }

  /**
   * Get content from the provided orderId **immediately** after it is delivered
   * @param orderId
   */
  public get(orderId: deliveryId): Promise<value> {
    return new Promise<value>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(`Timed out while getting order with id ${orderId}`)), 60000);
      this.wait(orderId, (gotKey) => {
        const orderKey = this.orders.get(orderId);
        if (gotKey === orderKey) {
          const data = this.receive(orderId);
          if (data) {
            resolve(data);
            clearTimeout(timeout);
          }
        }
      });
    });
  }
}
