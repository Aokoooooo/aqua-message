import { Bus, Subscriber } from "../src";

describe("test Subscriber", () => {
  test("Subscriber should be defined", () => {
    expect(Subscriber).toBeDefined();
    expect(Bus).toBeDefined();
  });

  let bus: Bus;
  const type1 = "TYPE1";
  const type2 = "TYPE2";
  const list: number[] = [];
  const mockFn = jest.fn((n: number) => list.push(n));

  beforeEach(() => {
    bus = new Bus();
  });

  afterEach(() => {
    list.splice(0, list.length);
    mockFn.mockClear();
  });

  test("`on` work well", () => {
    const sub = bus.createSubscriber();
    sub.on(type1, mockFn);
    sub.on(type1, mockFn);
    sub.on(type2, mockFn);

    bus.notify(type1, 1);
    bus.notify(type2, 2);
    bus.notify("FFFF", 3);

    expect(mockFn).toBeCalledTimes(2);
    expect(list).toEqual([1, 2]);
  });

  test("`off` work well", () => {
    const sub = bus.createSubscriber();
    sub.on(type1, mockFn);
    sub.on(type2, mockFn);
    sub.off(type1);

    bus.notify(type1, 1);
    bus.notify(type2, 2);

    expect(mockFn).toBeCalledTimes(1);
    expect(list).toEqual([2]);
    expect(() => sub.off(type1)).not.toThrow();
  });

  test("`once` work well", () => {
    const sub = bus.createSubscriber();
    sub.once(type1, mockFn);

    bus.notify(type1, 1);
    bus.notify(type1, 2);

    expect(mockFn).toBeCalledTimes(1);
    expect(list).toEqual([1]);
  });

  test("`emit` work well", () => {
    const sub = bus.createSubscriber();
    const sub2 = bus.createSubscriber();
    sub.on(type1, mockFn);

    sub.emit(type1, 1);
    sub2.emit(type1, 2);
    bus.notify(type1, 3);

    expect(mockFn).toBeCalledTimes(3);
    expect(list).toEqual([1, 2, 3]);
  });

  test("`clearAll` work well", () => {
    const sub = bus.createSubscriber();
    sub.on(type1, mockFn);
    sub.on(type2, mockFn);
    sub.clearAll();

    sub.emit(type1, 1);
    sub.emit(type2, 2);

    expect(mockFn).toBeCalledTimes(0);
    expect(list).toEqual([]);
  });

  test("calling sequence is correct", () => {
    const sub = bus.createSubscriber();
    const sub2 = bus.createSubscriber();
    sub.on(type1, mockFn);
    sub2.on(type2, mockFn);

    setTimeout(() => {
      sub2.emit(type1, 1);
    }, 1000);

    sub.emit(type2, 2);
    jest.advanceTimersByTime(999);
    mockFn(3);
    sub.emit(type1, 4);
    jest.advanceTimersByTime(1);
    bus.notify(type2, 5);

    expect(mockFn).toBeCalledTimes(5);
    expect(list).toEqual([2, 3, 4, 1, 5]);
  });
});
