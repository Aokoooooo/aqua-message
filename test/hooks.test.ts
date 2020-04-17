import { renderHook } from "@testing-library/react-hooks";
import { Bus, useMessage } from "../src";

describe("test hooks", () => {
  test("useMessage should be defined", () => {
    expect(useMessage).toBeDefined();
  });

  let bus: Bus;
  const type1 = "TYPE1";
  const type2 = "TYPE2";
  const list: number[] = [];
  const mockFn = jest.fn((n: number) => list.push(n));

  beforeAll(() => {
    spyOn(console, "error");
  });

  beforeEach(() => {
    bus = new Bus();
  });

  afterEach(() => {
    list.splice(0, list.length);
    mockFn.mockClear();
  });

  test("string type hook work well", () => {
    const hook = renderHook(() => useMessage(bus, type1, mockFn));
    bus.notify(type1, 1);
    hook.rerender();
    bus.notify(type1, 2);
    bus.notify(type1, 3);
    hook.unmount();
    bus.notify(type1, 4);

    expect(mockFn).toBeCalledTimes(3);
    expect(list).toEqual([1, 2, 3]);
  });

  test("string type hook with no callback should throw a error", () => {
    const fn = () => renderHook(() => useMessage(bus, type1, undefined));
    expect(fn).toThrow();
  });

  test("obj type hook work well", () => {
    const hook = renderHook(() => useMessage(bus, { [type1]: mockFn }));
    bus.notify(type1, 1);
    hook.rerender();
    bus.notify(type1, 2);
    bus.notify(type1, 3);
    hook.unmount();
    bus.notify(type1, 4);

    expect(mockFn).toBeCalledTimes(3);
    expect(list).toEqual([1, 2, 3]);
  });

  test("array type hook work well", () => {
    const hook = renderHook(() =>
      useMessage(bus, [{ [type1]: mockFn }, { [type2]: mockFn }])
    );
    bus.notify(type1, 1);
    bus.notify(type2, 11);
    hook.rerender();
    bus.notify(type1, 2);
    bus.notify(type2, 22);
    bus.notify(type1, 3);
    bus.notify(type2, 33);
    hook.unmount();
    bus.notify(type1, 4);
    bus.notify(type2, 44);

    expect(mockFn).toBeCalledTimes(6);
    expect(list).toEqual([1, 11, 2, 22, 3, 33]);
  });
});
