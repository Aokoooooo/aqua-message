import { Bus } from "./bus";

/**
 * event listener
 */
export class Subscriber<T extends Bus> {
  private readonly bus: T;

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
    const token = this.bus.on(type, callback);
    this.tokens.set(type, token);
  }

  /**
   *  log off the specific listening
   * @param type event type
   */
  public off(type: string) {
    this.bus.off(type, this.tokens.get(type) || 0);
    this.tokens.delete(type);
  }

  /**
   * listen for the specific event and call the `callback` function, but only execute once.
   * @param type event type
   * @param callback
   */
  public once(type: string, callback: CallbackType) {
    const onOnce = () => {
      this.off(type);
      callback();
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
