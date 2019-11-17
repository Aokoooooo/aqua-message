import { useOnMount, useOnUnmount } from "aqua-hooks";
import { useMemo } from "react";
import { Bus } from "./bus";
import { CallbackType, Subscriber } from "./subscriber";
export interface IUseMessage {
  [event: string]: CallbackType;
}

export function useMessage<T extends Bus>(
  bus: T,
  event: string,
  callback: CallbackType
): Subscriber<T>;
export function useMessage<T extends Bus>(
  bus: T,
  event?: IUseMessage | IUseMessage[]
): Subscriber<T>;
export function useMessage<T extends Bus>(
  bus: T,
  event?: string | IUseMessage | IUseMessage[],
  callback?: CallbackType
) {
  const subscriber = useMemo(() => {
    return bus.createSubscriber();
  }, [bus]);

  useOnMount(() => {
    if (typeof event === "undefined" || event === null) {
      return;
    } else if (typeof event === "string") {
      if (typeof callback !== "function") {
        return;
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
    if (typeof event === "undefined" || event === null) {
      return;
    } else if (typeof event === "string") {
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
