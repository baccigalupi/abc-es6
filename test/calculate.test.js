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
      expect(
        calculate(`
        if (a) { b; }
        else { c; }
      `)
      ).toEqual(2);
    });

    it("counts a multi-step if/else as a number for each block and one for each extra if", () => {
      expect(
        calculate(`
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
      `)
      ).toEqual(6);
    });

    it("counts nested if/elses the same way it would could them independently", () => {
      expect(
        calculate(`
        if (a) {
          if (b) {
            c;
          } else {
            d;
          }
        } else {
          e;
        }
      `)
      ).toEqual(4);
    });

    it("penalizes labeled statements", () => {
      expect(
        calculate(`
        goHere:
        a;
      `)
      ).toEqual(5);
    });

    it("penalizes break statements", () => {
      expect(
        calculate(`
        while(true) {
          if (a) {
            break;
          }
        }
      `)
      ).toEqual(4); // 1 for the while loop, 1 for the conditional, and 2 for the break
    });

    it("penalizes with statements", () => {
      expect(
        calculate(`
        with(a) {
          b;
        }
      `)
      ).toEqual(5);
    });

    it("adds a point for each block + one for the whole switch", () => {
      expect(
        calculate(`
        switch(a) {
          case x:
            b;
          case y:
            c;
          default:
            d;
        }
      `)
      ).toEqual(4);
    });

    it("throw adds a point to the score", () => {
      expect(
        calculate(`
        throw a;
      `)
      ).toEqual(1);
    });

    it("try/catch counts as 2", () => {
      expect(
        calculate(`
        try {
          a
        } catch(error) {
          b
        }
      `)
      ).toEqual(2);
    });

    it("logical and conditional operators each count as 1 point", () => {
      expect(
        calculate(`
        a && b;
      `)
      ).toEqual(1);

      expect(
        calculate(`
        a > b;
      `)
      ).toEqual(1);

      expect(
        calculate(`
        a == b;
      `)
      ).toEqual(1);
    });

    it("other binary operators also count as 1 point", () => {
      expect(
        calculate(`
        a + b;
      `)
      ).toEqual(1);

      expect(
        calculate(`
        a ** 2;
      `)
      ).toEqual(1);
    });

    it("unary prefix operators also get a point", () => {
      expect(
        calculate(`
        !a;
      `)
      ).toEqual(1);

      expect(
        calculate(`
        !!a;
      `)
      ).toEqual(2);

      expect(
        calculate(`
        +a;
      `)
      ).toEqual(1);
    });

    it("adds a point for unary postfix operators", () => {
      expect(
        calculate(`
        a++;
      `)
      ).toEqual(1);
    });

    it("for statements include one for the block, plus a normal evaluation of the conditional", () => {
      expect(
        calculate(`
        for (let i = 0; i < 9; i++) {
          a
        }
      `)
      ).toEqual(4);
    });

    it("calculates a for-in statement as 1 for the block and 1 for the assignment in the setup", () => {
      expect(
        calculate(`
        for (const a in b) {
          c;
        }
      `)
      ).toEqual(2);
    });

    it("function calls are each one point", () => {
      expect(
        calculate(`
        fn(a, b, c);
      `)
      ).toEqual(1);
    });

    it("member attribute access counts as 1", () => {
      expect(
        calculate(`
        a.b;
      `)
      ).toEqual(1);
    });

    it("member method calls counts as 2: one for the function call, one for the member attribute", () => {
      expect(
        calculate(`
        a.b(c);
      `)
      ).toEqual(2);
    });

    it("assignment from an array pattern counts as 1, and assignment counts as 1", () => {
      expect(
        calculate(`
        const [a, b, c] = z;
      `)
      ).toEqual(2);
    });

    it("assignment from an array pattern with rest adds an additional point", () => {
      expect(
        calculate(`
        const [a, b, ...c] = z;
      `)
      ).toEqual(3);
    });

    it("object pattern assignment includes one for assignment, and one for the pattern", () => {
      expect(
        calculate(`
        const {a, b} = z;
      `)
      ).toEqual(2);
    });

    it("object pattern assignment with a rest matcher adds one point", () => {
      expect(
        calculate(`
        const {a, b, ...c} = z;
      `)
      ).toEqual(3);
    });

    it("object literal declaration adds no extra points", () => {
      expect(
        calculate(`
        const x = {a: 1, b: 2};
      `)
      ).toEqual(1);
    });

    it("function declarations count as 1", () => {
      expect(
        calculate(`
        const x = () => {};
      `)
      ).toEqual(1);

      expect(
        calculate(`
        function x() {};
      `)
      ).toEqual(1);
    });

    it("adds a +1 when using this", () => {
      expect(
        calculate(`
        this;
      `)
      ).toEqual(1);

      expect(
        calculate(`
        this.super();
      `)
      ).toEqual(3);
    });

    it("adds one point per expression in a template string", () => {
      expect(calculate("`just string`")).toEqual(0);
      expect(calculate("`content: ${x}`")).toEqual(1);
      expect(calculate("`content: ${a} ${b}`")).toEqual(2);
      expect(calculate("`content: ${a.b} ${c.d()}`")).toEqual(5);
    });

    it("penalizes tagged template expressions", () => {
      expect(calculate("myTag`That ${person} is a ${age}.`;")).toEqual(5 + 2);
    });

    it("counts class declarations as a point", () => {
      expect(
        calculate(`
        class Foo {}
      `)
      ).toEqual(1);
    });

    it("counts each method declaration as a point", () => {
      expect(
        calculate(`
        class Foo {
          constructor() {}
          bar() {}
        }
      `)
      ).toEqual(3);
    });

    it("new-ing an object is counts as a point", () => {
      expect(calculate(`new Foo();`)).toEqual(1);
    });
  });
});
