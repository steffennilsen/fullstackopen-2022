import counterReducer from "./reducer";
import deepFreeze from "deep-freeze";

describe("unicafe reducer", () => {
  const initialState = Object.freeze({
    good: 0,
    ok: 0,
    bad: 0,
  });

  const reduceSimpleState = (type, _initialState = initialState) => {
    const action = { type };
    const state = _initialState;
    deepFreeze(state);
    return counterReducer(state, action);
  };

  test("should return a proper initial state when called with undefined state", () => {
    const state = {};
    const action = {
      type: "DO_NOTHING",
    };

    const newState = counterReducer(undefined, action);
    expect(newState).toEqual(initialState);
  });

  test("good is incremented", () => {
    const newState = reduceSimpleState("GOOD");
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0,
    });
  });

  test("ok is incremented", () => {
    const newState = reduceSimpleState("OK");
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0,
    });
  });

  test("bad is incremented", () => {
    const newState = reduceSimpleState("BAD");
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1,
    });
  });

  test("zeroized is incremented", () => {
    const newState = reduceSimpleState("ZERO", {
      good: 1,
      ok: 2,
      bad: 1,
    });
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 0,
    });
  });
});
