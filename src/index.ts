import { Bus } from "./bus";
import { IUseMessage, useMessage } from "./hooks";
import { CallbackType, Subscriber } from "./subscriber";

const bus = new Bus();

export { Bus, CallbackType, Subscriber, useMessage, IUseMessage };
export default bus;
