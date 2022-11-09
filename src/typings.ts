import { Diagnostic } from 'vscode-languageserver-types'

export const enum SyntaxKind {
    Unknown,
    EndOfFileToken,
    Goevaluate,

    // Expression
    BinaryExpression,
    PrefixExpression,
    CallExpression,

    // Functions and Accessors
    Function,
    Accessor,

    // Literals
    NumericLiteral,
    StringLiteral,

    // Contextual keywords
    BooleanKeyword,

    // Punctuation
    OpenBraceToken,
    CloseBraceToken,
    OpenParenToken,
    CloseParenToken,
    OpenBracketToken,
    CloseBracketToken,
    DotToken,
    DotDotDotToken,
    SemicolonToken,
    CommaToken,
    QuestionDotToken,
    LessThanToken,
    LessThanSlashToken,
    GreaterThanToken,
    LessThanEqualsToken,
    GreaterThanEqualsToken,
    EqualsEqualsToken,
    EqualsTildeToken,
    ExclamationEqualsToken,
    ExclamationTildeToken,
    EqualsEqualsEqualsToken,
    ExclamationEqualsEqualsToken,
    EqualsGreaterThanToken,
    PlusToken,
    MinusToken,
    AsteriskToken,
    AsteriskAsteriskToken,
    SlashToken,
    PercentToken,
    PlusPlusToken,
    MinusMinusToken,
    LessThanLessThanToken,
    GreaterThanGreaterThanToken,
    GreaterThanGreaterThanGreaterThanToken,
    AmpersandToken,
    BarToken,
    CaretToken,
    ExclamationToken,
    TildeToken,
    AmpersandAmpersandToken,
    BarBarToken,
    QuestionToken,
    ColonToken,
    AtToken,
    QuestionQuestionToken,
    InToken
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
    readonly operand: CallExpression | AccessorExpression
}

export interface ExpressionArray extends ReadonlyArray<Expression>, ReadonlyTextRange {
}

export interface CallExpression extends Expression {
    readonly kind: SyntaxKind.CallExpression
    readonly expression: SyntaxKind.Function
    readonly arguments: ExpressionArray
}

export interface AccessorExpression extends Expression {
    readonly kind: SyntaxKind.Accessor;
    readonly escapedText: string
}

export interface Goevaluate {
    readonly kind: SyntaxKind.Goevaluate;
    text: string
    parseDiagnostics: Diagnostic[]
}

export enum CharacterCodes {
    // Unicode's White Space
    tab = 0x09,                   // \t
    lineFeed = 0x0A,              // \n
    verticalTab = 0x0B,           // \v
    formFeed = 0x0C,              // \f
    carriageReturn = 0x0D,        // \r
    space = 0x0020,               // " "

    a = 0x61,
    b = 0x62,
    c = 0x63,
    d = 0x64,
    e = 0x65,
    f = 0x66,
    g = 0x67,
    h = 0x68,
    i = 0x69,
    j = 0x6A,
    k = 0x6B,
    l = 0x6C,
    m = 0x6D,
    n = 0x6E,
    o = 0x6F,
    p = 0x70,
    q = 0x71,
    r = 0x72,
    s = 0x73,
    t = 0x74,
    u = 0x75,
    v = 0x76,
    w = 0x77,
    x = 0x78,
    y = 0x79,
    z = 0x7A,

    A = 0x41,
    B = 0x42,
    C = 0x43,
    D = 0x44,
    E = 0x45,
    F = 0x46,
    G = 0x47,
    H = 0x48,
    I = 0x49,
    J = 0x4A,
    K = 0x4B,
    L = 0x4C,
    M = 0x4D,
    N = 0x4E,
    O = 0x4F,
    P = 0x50,
    Q = 0x51,
    R = 0x52,
    S = 0x53,
    T = 0x54,
    U = 0x55,
    V = 0x56,
    W = 0x57,
    X = 0x58,
    Y = 0x59,
    Z = 0x5a,

    _0 = 0x30,
    _9 = 0x39,

    _ = 0x5F,

    ampersand = 0x26,             // &
    asterisk = 0x2A,              // *
    at = 0x40,                    // @
    backslash = 0x5C,             // \
    backtick = 0x60,              // `
    bar = 0x7C,                   // |
    caret = 0x5E,                 // ^
    closeBrace = 0x7D,            // }
    closeBracket = 0x5D,          // ]
    closeParen = 0x29,            // )
    colon = 0x3A,                 // :
    comma = 0x2C,                 // ,
    dot = 0x2E,                   // .
    doubleQuote = 0x22,           // "
    equals = 0x3D,                // =
    exclamation = 0x21,           // !
    greaterThan = 0x3E,           // >
    hash = 0x23,                  // #
    lessThan = 0x3C,              // <
    minus = 0x2D,                 // -
    openBrace = 0x7B,             // {
    openBracket = 0x5B,           // [
    openParen = 0x28,             // (
    percent = 0x25,               // %
    plus = 0x2B,                  // +
    question = 0x3F,              // ?
    semicolon = 0x3B,             // ;
    singleQuote = 0x27,           // '
    slash = 0x2F,                 // /
    tilde = 0x7E,                 // ~
}
