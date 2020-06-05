import { createToken, CstParser, Lexer, tokenMatcher } from "chevrotain";

import { Range } from "../range";
import { SheetMatrix, Cell, isCell } from "../types";


// using the NA pattern marks this Token class as 'irrelevant' for the Lexer.
// AdditionOperator defines a Tokens hierarchy but only the leafs in this hierarchy define
// actual Tokens that can appear in the text
const AdditionOperator = createToken({name: "AdditionOperator", pattern: Lexer.NA});
const Plus = createToken({name: "Plus", pattern: /\+/, categories: AdditionOperator});
const Minus = createToken({name: "Minus", pattern: /-/, categories: AdditionOperator});

const MultiplicationOperator = createToken({name: "MultiplicationOperator", pattern: Lexer.NA});
const Multi = createToken({name: "Multi", pattern: /\*/, categories: MultiplicationOperator});
const Div = createToken({name: "Div", pattern: /\//, categories: MultiplicationOperator});

const LParen = createToken({name: "LParen", pattern: /\(/});
const RParen = createToken({name: "RParen", pattern: /\)/});
const NumberLiteral = createToken({name: "NumberLiteral", pattern: /[1-9]\d*/});
const StringLiteral = createToken({name: "StringLiteral", pattern: /".*"/});

const PowerFunc = createToken({name: "PowerFunc", pattern: /power/});
const Comma = createToken({name: "Comma", pattern: /,/});

const char = "([a-zA-Z])+";
const num = "([0-9])+";
const RCell = createToken({name: "Cell", pattern: new RegExp(`${char}${num}`)});

// marking WhiteSpace as 'SKIPPED' makes the lexer skip it.
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

const allTokens = [WhiteSpace, Plus, Minus, Multi, Div, LParen, RParen, NumberLiteral, StringLiteral, AdditionOperator, MultiplicationOperator, PowerFunc, Comma, RCell];
const CalculatorLexer = new Lexer(allTokens);


// ----------------- parser -----------------
// Note that this is a Pure grammar, it only describes the grammar
// Not any actions (semantics) to perform during parsing.
class CalculatorPure extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  expression = this.RULE("expression", () => {
    this.SUBRULE(this.additionExpression)
  });

  additionExpression = this.RULE("additionExpression", () => {
    this.SUBRULE(this.multiplicationExpression, {LABEL: "lhs"});
    this.MANY(() => {
      // consuming 'AdditionOperator' will consume either Plus or Minus as they are subclasses of AdditionOperator
      this.CONSUME(AdditionOperator);
      //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
      this.SUBRULE2(this.multiplicationExpression, {LABEL: "rhs"});
    });
  });

  multiplicationExpression = this.RULE("multiplicationExpression", () => {
    this.SUBRULE(this.atomicExpression, {LABEL: "lhs"});
    this.MANY(() => {
      this.CONSUME(MultiplicationOperator);
      //  the index "2" in SUBRULE2 is needed to identify the unique position in the grammar during runtime
      this.SUBRULE2(this.atomicExpression, {LABEL: "rhs"});
    });
  });

  atomicExpression = this.RULE("atomicExpression", () => this.OR([
    // parenthesisExpression has the highest precedence and thus it appears
    // in the "lowest" leaf in the expression ParseTree.
    {ALT: () => this.SUBRULE(this.parenthesisExpression)},
    {ALT: () => this.CONSUME(RCell)},
    {ALT: () => this.CONSUME(NumberLiteral)},
    {ALT: () => this.CONSUME(StringLiteral)},
    {ALT: () => this.SUBRULE(this.powerFunction)}
  ]));

  parenthesisExpression = this.RULE('parenthesisExpression', () => {
    this.CONSUME(LParen);
    this.SUBRULE(this.expression);
    this.CONSUME(RParen);
  });

  powerFunction = this.RULE('powerFunction', () => {
    this.CONSUME(PowerFunc);
    this.CONSUME(LParen);
    this.SUBRULE(this.expression, {LABEL: "base"});
    this.CONSUME(Comma);
    this.SUBRULE2(this.expression, {LABEL: "exponent"});
    this.CONSUME(RParen);
  })
}

// wrapping it all together
// reuse the same parser instance.
const parser = new CalculatorPure();

// A mini cell math module, TODO put it somewhere
const op = {
  plus: (c1: Cell, c2: Cell): Cell => {
    if (c1.kind === 'float' && c2.kind === 'float') {
      return { kind: 'float', value: c1.value + c2.value }
    } else if (c1.kind === 'string' && c2.kind === 'string') {
      return { kind: 'string', value: c1.value + c2.value }
    }
    throw new Error('Not implemented');
  },
  subtract: (c1: Cell, c2: Cell): Cell => {
    if (c1.kind === 'float' && c2.kind === 'float') {
      return { kind: 'float', value: c1.value - c2.value }
    }
    throw new Error('Not implemented');
  },
  multiply: (c1: Cell, c2: Cell): Cell => {
    if (c1.kind === 'float' && c2.kind === 'float') {
      return { kind: 'float', value: c1.value * c2.value }
    }
    throw new Error('Not implemented');
  },
  divide: (c1: Cell, c2: Cell): Cell => {
    if (c1.kind === 'float' && c2.kind === 'float') {
      return { kind: 'float', value: c1.value / c2.value }
    }
    throw new Error('Not implemented');
  },
};

const fn = {
  power: (base: Cell, exp: Cell): Cell => {
    if (base.kind === 'float' && exp.kind === 'float') {
      return { kind: 'float', value: Math.pow(base.value, exp.value) }
    }
    throw new Error('Not implemented');
  }
}

 // ----------------- Interpreter -----------------
const BaseCstVisitor = parser.getBaseCstVisitorConstructor()

class CalculatorInterpreter extends BaseCstVisitor {
  sheetMatrix: SheetMatrix;
  constructor(sheetMatrix: SheetMatrix) {
    super();
    this.sheetMatrix = sheetMatrix;
    this.validateVisitor();
  }

  expression(ctx: any) {
    return this.visit(ctx.additionExpression)
  }

  additionExpression(ctx: any)  {
    let result = this.visit(ctx.lhs)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand: any, idx: number) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand)

        let operator = ctx.AdditionOperator[idx]

        if (tokenMatcher(operator, Plus)) {
          result = op.plus(result, rhsValue)
        } else {
          result = op.subtract(result, rhsValue)
        }
      })
    }

    return result
  }

  multiplicationExpression(ctx: any) {
    let result = this.visit(ctx.lhs)

    // "rhs" key may be undefined as the grammar defines it as optional (MANY === zero or more).
    if (ctx.rhs) {
      ctx.rhs.forEach((rhsOperand: any, idx: any) => {
        // there will be one operator for each rhs operand
        let rhsValue = this.visit(rhsOperand)
        let operator = ctx.MultiplicationOperator[idx]

        if (tokenMatcher(operator, Multi)) {
          result = op.multiply(result, rhsValue)
        } else {
          result = op.divide(result, rhsValue)
        }
      })
    }

    return result
  }

  atomicExpression(ctx: any) {
    if (ctx.parenthesisExpression) {
      // passing an array to "this.visit" is equivalent
      // to passing the array's first element
      return this.visit(ctx.parenthesisExpression)
    }
    else if (ctx.Cell) {
      // resolves simple cells
      // TODO tidy up
      const cell = Range.resolve(ctx.Cell[0].image, this.sheetMatrix);
      if (isCell(cell) && (cell.kind === 'float' || cell.kind === 'string')) {
        return cell;
      }
      throw new Error('TODO make helpful');
    }
    else if (ctx.NumberLiteral) {
      // If a key exists on the ctx, at least one element is guaranteed
      const value = parseInt(ctx.NumberLiteral[0].image, 10)
      return { kind: 'float', value };
    }
    else if (ctx.StringLiteral) {
      const withQuotes = ctx.StringLiteral[0].image;
      const withoutQuotes = withQuotes.substring(1, withQuotes.length-1);
      return { kind: 'string', value: withoutQuotes };
    }
    else if (ctx.powerFunction) {
      return this.visit(ctx.powerFunction)
    }
  }

  parenthesisExpression(ctx: any) {
    // The ctx will also contain the parenthesis tokens, but we don't care about those
    // in the context of calculating the result.
    return this.visit(ctx.expression)
  }

  powerFunction(ctx: any) {
    const base = this.visit(ctx.base);
    const exponent = this.visit(ctx.exponent);
    return fn.power(base, exponent)
  }
}

// processes a single formula and returns it's result as a Cell
export const evalFormula = (inputText: string, sheetMatrix: SheetMatrix): Cell => {
  const interpreterInstance = new CalculatorInterpreter(sheetMatrix);
  // Lex
  const lexResult = CalculatorLexer.tokenize(inputText)
  parser.input = lexResult.tokens

  // Automatic CST created when parsing
  const cst = parser.expression()
  if (parser.errors.length > 0) {
    throw Error(
      "Sad sad panda, parsing errors detected!\n" +
        parser.errors[0].message
    )
  }

  // Visit
  const result = interpreterInstance.visit(cst)
  return result
}
