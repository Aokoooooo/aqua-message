import { Bus } from "./bus";

/**
 * event listener
 */
export class Subscriber<T extends Bus> {
  /**
   * the publisher
   */
  private readonly bus: T;

  /**
   * map<type, token>, the token is used by the bus to unsubscribe the callback
   */
  private tokens = new Map<string, number>();

  constructor(bus: T) {
    this.bus = bus;
  }

  /**
   * emit messages with the type, `bus` will notify this to all the listeners
   * @param type event type
   * @param args
   */
  public emit(type: string, ...args: any[]) {
    this.bus.notify(type, ...args);
  }

  /**
   * listen for the specific event and call the `callback` function
   * @param type event type
   * @param callback
   */
  public on(type: string, callback: CallbackType) {
    if (this.tokens.has(type)) {
      this.off(type);
    }
    const token = this.bus.on(type, callback);
    this.tokens.set(type, token);
  }

  /**
   *  logout the specific listening
   * @param type event type
   */
  public off(type: string) {
    const token = this.tokens.get(type);
    this.bus.off(type, typeof token === "number" ? token : -1);
    this.tokens.delete(type);
  }

  /**
   * listen for the specific event and call the `callback` function, but only execute once.
   * @param type event type
   * @param callback
   */
  public once(type: string, callback: CallbackType) {
    const onOnce: CallbackType = (...args) => {
      this.off(type);
      callback(...args);
    };
    this.on(type, onOnce);
  }

  /**
   * remove all listenings
   */
  public clearAll() {
    this.tokens.forEach((v, k) => this.bus.off(k, v));
    this.tokens.clear();
  }
}

export type CallbackType = (...args: any[]) => any;
