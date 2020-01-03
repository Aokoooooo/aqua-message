import Aqua, { Bus } from "../src";

describe("test Bus", () => {
  test("Bus should be defined", () => {
    expect(Aqua).toBeDefined();
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
    const mockFn = jest.fn();
    expect(bus.on(type1, mockFn)).toBe(0);
    expect(bus.on(type1, mockFn)).toBe(1);
    expect(bus.on(type2, mockFn)).toBe(2);
  });

  test("`notify` work well", () => {
    bus.on(type1, mockFn);
    bus.on(type2, mockFn);

    bus.notify(type2, 1);
    bus.notify("EEEE", 1);
    bus.notify(type1, 2);
    bus.notify("FFFF", 1);
    bus.notify(type2, 3);
    bus.notify("GGGG", 1);
    expect(mockFn).toBeCalledTimes(3);
    expect(list).toEqual([1, 2, 3]);
  });

  test("`off` work well", () => {
    const token = bus.on(type1, mockFn);
    bus.on(type2, mockFn);
    bus.off(type1, token);

    bus.notify(type2, 1);
    bus.notify("EEEE", 1);
    bus.notify(type1, 2);
    bus.notify("FFFF", 1);
    bus.notify(type2, 3);
    bus.notify("GGGG", 1);
    expect(mockFn).toBeCalledTimes(2);
    expect(list).toEqual([1, 3]);
    expect(() => bus.off("EEEE", token)).not.toThrow();
  });

  test("`clearAll` work well", () => {
    bus.on(type1, mockFn);
    bus.on(type2, mockFn);
    bus.clearAll();

    bus.notify(type2, 1);
    bus.notify("EEEE", 1);
    bus.notify(type1, 2);
    bus.notify("FFFF", 1);
    bus.notify(type2, 3);
    bus.notify("GGGG", 1);
    expect(mockFn).toBeCalledTimes(0);
    expect(list).toEqual([]);
  });

  test("`createSubscriber` work well", () => {
    const sub = bus.createSubscriber();
    expect(sub).toBeDefined();

    sub.on(type1, mockFn);
    sub.emit(type1, 1);
    sub.emit(type2, 2);
    bus.notify(type1, 3);
    bus.notify(type2, 4);

    expect(mockFn).toBeCalledTimes(2);
    expect(list).toEqual([1, 3]);
  });

  test("calling sequence is correct", () => {
    bus.on(type1, mockFn);

    setTimeout(() => {
      mockFn(2);
      bus.notify(type1, 3);
    }, 1000);

    bus.notify(type1, 1);
    jest.advanceTimersByTime(999);
    bus.notify(type1, 4);
    jest.advanceTimersByTime(1);
    bus.notify(type1, 5);
    expect(mockFn).toBeCalledTimes(5);
    expect(list).toEqual([1, 4, 2, 3, 5]);
  });
});
