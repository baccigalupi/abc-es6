import { Parser } from "acorn";
import * as walk from "acorn-walk";
import * as jsxExtension from "acorn-jsx";

const bumpScoreWithNode =
  (data, n = 1) =>
  () => {
    data.score += n;
  };

const bumpScore = (data, n = 1) => {
  data.score += n;
};

const debug = console.log;

export const calculate = (code) => {
  const dataContext = {
    score: 0,
  };

  walk.simple(Parser.parse(code), {
    Expression: debug,
    // -------------------------

    AssignmentExpression: bumpScoreWithNode(dataContext),

    VariableDeclarator: (node) => {
      if (node.init) {
        bumpScore(dataContext);
      }
    },

    ConditionalExpression: bumpScoreWithNode(dataContext, 3),

    IfStatement: (node) => {
      bumpScore(dataContext);

      if (node.alternate) {
        bumpScore(dataContext);
      }
    },

    LabeledStatement: bumpScoreWithNode(dataContext, 5),
    WhileStatement: bumpScoreWithNode(dataContext),
    BreakStatement: bumpScoreWithNode(dataContext, 2),
    WithStatement: bumpScoreWithNode(dataContext, 5),

    SwitchStatement: (node) => {
      bumpScore(dataContext, 1 + node.cases.length);
    },

    ThrowStatement: bumpScoreWithNode(dataContext),

    TryStatement: (node) => {
      bumpScore(dataContext);

      if (node.handler) {
        bumpScore(dataContext);
      }

      if (node.finalizer) {
        bumpScore(dataContext);
      }
    },

    LogicalExpression: bumpScoreWithNode(dataContext),
    BinaryExpression: bumpScoreWithNode(dataContext),
    UnaryExpression: bumpScoreWithNode(dataContext),
    UpdateExpression: bumpScoreWithNode(dataContext),
    ForStatement: bumpScoreWithNode(dataContext),
    ForInStatement: bumpScoreWithNode(dataContext, 2),
    CallExpression: bumpScoreWithNode(dataContext),
    MemberExpression: bumpScoreWithNode(dataContext),
    ArrayPattern: bumpScoreWithNode(dataContext),
    RestElement: bumpScoreWithNode(dataContext),

    ObjectPattern: (node) => {
      bumpScore(dataContext);

      const last = node.properties[node.properties.length - 1];

      if (last.type == "RestElement") {
        bumpScore(dataContext);
      }
    },

    FunctionDeclaration: bumpScoreWithNode(dataContext),
    ThisExpression: bumpScoreWithNode(dataContext),

    TemplateLiteral: (node) => {
      bumpScore(dataContext, node.expressions.length);
    },
    TaggedTemplateExpression: bumpScoreWithNode(dataContext, 5),
    ClassDeclaration: bumpScoreWithNode(dataContext),
    MethodDefinition: bumpScoreWithNode(dataContext),
    NewExpression: bumpScoreWithNode(dataContext),
  });

  return dataContext.score;
};
