import { expect, vi, describe, test, beforeEach } from "vitest";
import { info, error, warn, success } from "./logger.js";

console.log = vi.fn();

describe("logger", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("info", () => {
    info("get", "This is a message");

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("This is a message")
    );
  });

  test("warn", () => {
    warn("get", "This is a message");

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("This is a message")
    );
  });

  test("success", () => {
    success("get", "This is a message");

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("This is a message")
    );
  });

  test("error", () => {
    error(403, "This is an error");

    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("This is an error")
    );
  });
});
