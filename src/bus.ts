import { CallbackType, Subscriber } from "./subscriber";

/**
 * event bus
 */
export class Bus {
  private subscription: Map<string, Map<number, CallbackType>> = new Map();

  private token = 0;

  /**
   * when the `subscriber` `$emit()` some message,
   *  the `bus` will notify these to all the subscriber who listened this event.
   * @param type event type
   * @param args
   */
  public notify(type: string, ...args: any[]) {
    if (!this.subscription.has(type)) {
      return;
    }
    const listeners = this.subscription.get(type);
    listeners!.forEach(callback => {
      callback(...args);
    });
  }

  /**
   * register the `callback` function into the listeners.
   * @param type event type
   * @param callback
   */
  public on(type: string, callback: CallbackType) {
    if (!this.subscription.has(type)) {
      this.subscription.set(type, new Map());
    }
    const listeners = this.subscription.get(type);
    listeners!.set(this.token, callback);
    return this.token++;
  }

  /**
   * log off the specific listening
   * @param type event type
   * @param token returned by `this.on()`
   */
  public off(type: string, token: number) {
    if (!this.subscription.has(type)) {
      return;
    }
    const listeners = this.subscription.get(type);
    listeners!.delete(token);
  }

  /**
   * remove all the listeners
   */
  public clearAll() {
    this.subscription.clear();
  }

  /**
   * create a subscriber
   */
  public createSubscriber() {
    return new Subscriber(this);
  }
}
