import { Parser }  from "acorn";
import * as walk from "acorn-walk";
import * as jsxExtension from "acorn-jsx";

export const calculate = (code) => {
  let score = 0;

  walk.simple(Parser.parse(code), {
    Expression: (node) => {
      // console.log(node);
    },
    // -------------------------

    AssignmentExpression: (_node) => {
      score += 1;
    },

    VariableDeclarator: (node) => {
      if (node.init) { score += 1; }
    },

    ConditionalExpression: (_node) => {
      score += 3;
    },

    IfStatement: (node) => {
      score += 1;

      if (node.alternate) {
        score += 1;
      }
    },

    LabeledStatement: (_node) => {
      score += 5;
    },

    WhileStatement: (_node) => {
      score += 1;
    },

    BreakStatement: (_node) => {
      score += 2;
    },

    WithStatement: (_node) => {
      score += 5;
    },
  });

    // SwitchStatement
    // SwitchCase
    // ReturnStatement
    // ThrowStatement
    // TryStatement
    // CatchClause
    // ForStatement
    // ForInStatement
    // ForInit
    // FunctionDeclaration
    // Function
    // Pattern
    // RestElement
    // ArrayPattern
    // ObjectPattern
    // ThisExpression
    // ArrayExpression

  return score;
};