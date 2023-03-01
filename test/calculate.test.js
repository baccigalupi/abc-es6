import { describe, expect, it } from "vitest";
import { calculate } from "../lib/calculate";

describe("calculate", () => {
  describe("assignments", () => {
    it("has a score of 1 for a basic assignment", () => {
      expect(calculate("a = 1;")).toEqual(1);
      expect(calculate("a += 1;")).toEqual(1);
    });

    it("does not count variable declaration without assignment", () => {
      expect(calculate("let a;")).toEqual(0);
    });

    it("doesn't count the const/let declaration as assignment", () => {
      expect(calculate("const a = 1;")).toEqual(1);
      expect(calculate("let a = 1;")).toEqual(1);
    });
  });

  describe("branch", () => {
    it("counts a ternary with no other logic as a 3", () => {
      // ternary operations seem succinct, but are very hard to read. This adds
      // a 1 point penalty in addation to the two branches.
      expect(calculate("a ? b : c;")).toEqual(3);
    });
  });
});
