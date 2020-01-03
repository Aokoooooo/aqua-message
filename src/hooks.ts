import { useOnMount, useOnUnmount } from "aqua-hooks";
import { useMemo } from "react";
import { Bus } from "./bus";
import { CallbackType, Subscriber } from "./subscriber";
export interface IUseMessage {
  [event: string]: CallbackType;
}

/**
 * this `hooks` is used in `react functional component` to auto subscribe and unsubscribe the specific events
 * on the  `mounted` and `willUnMount` lifecycle.
 * @param bus
 * @param event event type name
 * @param callback
 */
export function useMessage<T extends Bus>(
  bus: T,
  event: string,
  callback: CallbackType
): Subscriber<T>;
/**
 * this `hooks` is used in `react functional component` to auto subscribe and unsubscribe the specific events
 * in the  `mounted` and `willUnMount` lifecycle.
 * @param bus
 * @param event a function or a list of function which the function name will be set as the event type name.
 */
export function useMessage<T extends Bus>(
  bus: T,
  event: IUseMessage | IUseMessage[]
): Subscriber<T>;
/**
 *
 * @param bus
 * @param event
 * @param callback
 */
export function useMessage<T extends Bus>(
  bus: T,
  event: string | IUseMessage | IUseMessage[],
  callback?: CallbackType
) {
  const subscriber = useMemo(() => {
    return bus.createSubscriber();
  }, [bus]);

  useOnMount(() => {
    if (typeof event === "string") {
      if (typeof callback !== "function") {
        throw new Error("need to pass a callback function as the thrid param");
      }
      subscriber.on(event, callback);
    } else if (Array.isArray(event)) {
      event.forEach(i => {
        Object.keys(i).forEach(key => {
          subscriber.on(key, i[key]);
        });
      });
    } else {
      Object.keys(event).forEach(key => {
        subscriber.on(key, event[key]);
      });
    }
  });

  useOnUnmount(() => {
    if (typeof event === "string") {
      subscriber.off(event);
    } else if (Array.isArray(event)) {
      event.forEach(i => {
        Object.keys(i).forEach(key => {
          subscriber.off(key);
        });
      });
    } else {
      Object.keys(event).forEach(key => {
        subscriber.off(key);
      });
    }
  });

  return subscriber;
}
