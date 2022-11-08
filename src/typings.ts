export const enum SyntaxKind {
    // Expression
    BinaryExpression,
    PrefixExpression,
    CallExpression,

    // Punctuation
    CommaToken,
    QuestionToken,
    ColonToken,
    QuestionQuestionToken,
    MinusToken,
    TildeToken,
    ExclamationToken
}

export interface ReadonlyTextRange {
    readonly pos: number
    readonly end: number
}

export interface Expression extends ReadonlyTextRange {
}

export type BinaryOperatorToken
    = SyntaxKind.CommaToken
    | SyntaxKind.QuestionToken
    | SyntaxKind.ColonToken
    | SyntaxKind.QuestionQuestionToken

export interface BinaryExpression extends Expression {
    readonly kind: SyntaxKind.BinaryExpression
    readonly left: Expression
    readonly operatorToken: BinaryOperatorToken
    readonly right: Expression
}

export type PrefixOperator
    = SyntaxKind.MinusToken
    | SyntaxKind.TildeToken
    | SyntaxKind.ExclamationToken

export interface PrefixExpression extends Expression {
    readonly kind: SyntaxKind.PrefixExpression
    readonly operator: PrefixOperator
    readonly operand: CallExpression | Identifier
}

export interface ExpressionArray extends ReadonlyArray<Expression>, ReadonlyTextRange {
}

export interface CallExpression extends Expression {
    readonly kind: SyntaxKind.CallExpression
    readonly expression: Identifier
    readonly arguments: ExpressionArray
}

export interface Identifier extends Expression {
    readonly escapedText: string
}
