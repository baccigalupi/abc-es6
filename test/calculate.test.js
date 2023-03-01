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
    it("penalizes a ternary with an extra branch score", () => {
      // ternary operations seem succinct, but are very hard to read. This adds
      // a 1 point penalty in addation to the two branches.
      expect(calculate("a ? b : c;")).toEqual(3);
    });

    it("counts an if with only one block as 1 point", () => {
      expect(calculate("if (a) { b; }")).toEqual(1);
    });

    it("counts an if/else as a 2", () => {
      expect(calculate(`
        if (a) { b; }
        else { c; }
      `)).toEqual(2);
    });

    it("counts a multi-step if/else as a number for each block and one for each extra if", () => {
      expect(calculate(`
        if (a) {
          b;
        }
        else if (c) {
          d;
        }
        else if (e) {
          f;
        }
        else {
          g;
        }
      `)).toEqual(6);
    });

    it("counts nested if/elses the same way it would could them independently", () => {
      expect(calculate(`
        if (a) {
          if (b) {
            c;
          } else {
            d;
          }
        } else {
          e;
        }
      `)).toEqual(4);
    });

    it("penalizes labeled statements", () => {
      expect(calculate(`
        goHere:
        a;
      `)).toEqual(5);
    });

    it("penalizes break statements", () => {
      expect(calculate(`
        while(true) {
          if (a) {
            break;
          }
        }
      `)).toEqual(4); // 1 for the while loop, 1 for the conditional, and 2 for the break
    });

    it("penalizes with statements", () => {
      expect(calculate(`
        with(a) {
          b;
        }
      `)).toEqual(5);
    });
  });
});
