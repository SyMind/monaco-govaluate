import { Diagnostic, Position, Range } from 'vscode-languageserver-types'
import { CharacterCodes, SyntaxKind } from './typings'

export class MultiLineStream {
    private source: string
	private len: number
	private position: number

    constructor(source: string) {
		this.source = source
		this.len = source.length
		this.position = 0
	}

    substring(from: number, to: number = this.position): string {
		return this.source.substring(from, to)
	}

	eos(): boolean {
		return this.len <= this.position
	}

	pos(): number {
		return this.position
	}

	goBackTo(pos: number): void {
		this.position = pos
	}

	goBack(n: number): void {
		this.position -= n
	}

	advance(n: number): void {
		this.position += n
	}

	nextChar(): number {
		return this.source.charCodeAt(this.position++) || 0
	}

	peekChar(n: number = 0): number {
		return this.source.charCodeAt(this.position + n) || 0
	}

	lookbackChar(n: number = 0): number {
		return this.source.charCodeAt(this.position - n) || 0
	}

	advanceIfChar(ch: number): boolean {
		if (ch === this.source.charCodeAt(this.position)) {
			this.position++
			return true
		}
		return false
	}

	advanceIfChars(ch: number[]): boolean {
		if (this.position + ch.length > this.source.length) {
			return false
		}
		let i = 0
		for (; i < ch.length; i++) {
			if (this.source.charCodeAt(this.position + i) !== ch[i]) {
				return false
			}
		}
		this.advance(i)
		return true
	}

	advanceWhileChar(condition: (ch: number) => boolean): number {
		const posNow = this.position
		while (this.position < this.len && condition(this.source.charCodeAt(this.position))) {
			this.position++
		}
		return this.position - posNow
	}
}

function isDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._9
}

function isHexDigit(ch: number): boolean {
    return isDigit(ch) || ch >= CharacterCodes.a && ch <= CharacterCodes.f
}

function isLetter(ch: number): boolean {
    return (65 <= ch && ch <= 90) || (97 <= ch && ch <= 122) || (ch >= 128 && ch !== 133 && ch !== 160)
}

function isVariableName(ch: number): boolean {
    return isLetter(ch) || isDigit(ch) || ch === CharacterCodes._ || ch === CharacterCodes.dot
}

function isQuote(ch: number): boolean {
	return ch === CharacterCodes.doubleQuote || ch === CharacterCodes.singleQuote
}

export interface IToken {
	type: SyntaxKind
	text: string
	offset: number
	len: number
}

type ErrorCallback = (message: Diagnostic) => void

export class Scanner {
    stream = new MultiLineStream('')

    functions: string[]

    constructor(functions: string[]) {
        this.functions = functions
    }

    onError?: ErrorCallback

    setSource(input: string): void {
		this.stream = new MultiLineStream(input)
	}

    setOnError(errorCallback: ErrorCallback | undefined) {
        this.onError = errorCallback
    }

    error(message: string, start: number, length?: number) {
        if (this.onError) {
            const s = start ?? this.stream.pos()
            const l = length ?? 0
            const range = Range.create(Position.create(0, s), Position.create(s, s + l))
            this.onError({
                range,
                message
            })
        }
    }

    scan(): IToken {
		// processes all whitespaces
		this._whitespace()

		const offset = this.stream.pos()

		// End of file/input
		if (this.stream.eos()) {
			return this.finishToken(offset, SyntaxKind.EndOfFileToken)
		}
		return this.scanNext(offset)
	}

    scanNext(offset: number): IToken {
        const ch = this.stream.peekChar()

		// numeric constant
        if (ch === CharacterCodes._0 && this.stream.peekChar(1) === CharacterCodes.x) {
            this.stream.advance(2)
            let expected = false
            this.stream.advanceWhileChar(ch => {
                if (isHexDigit(ch)) {
                    expected = true
                    return true
                }
                return false
            })
            if (!expected) {
                this.error('Hexadecimal digit expected.', offset)
            }
            return this.finishToken(offset, SyntaxKind.NumericLiteral)
        }
        if (ch >= CharacterCodes._0 && ch <= CharacterCodes._9 || ch === CharacterCodes.dot) {
            let expected = false
            this.stream.advanceWhileChar(ch => {
                if (isDigit(ch)) {
                    expected = true
                    return true
                }
                return false
            })
            if (!expected) {
                this.error('Numeric literal expected.', offset)
            }
            return this.finishToken(offset, SyntaxKind.NumericLiteral)
        }

        // comma, separator
        if (ch === CharacterCodes.comma) {
            return this.finishToken(offset, SyntaxKind.CommaToken)
        }

        // escaped variable
        if (ch === CharacterCodes.openBracket) {
            this.stream.advance(1)
            let completed = false
            this.stream.advanceWhileChar(ch => {
                if (ch === CharacterCodes.closeBracket) {
                    completed = true
                    return false
                }
                return true
            })
            if (!completed) {
                this.error('Unclosed parameter bracket', offset)
            }
            return this.finishToken(offset, SyntaxKind.StringLiteral)
		}

        // variable - or function
        if (isLetter(ch)) {
            this.stream.advanceWhileChar(isVariableName)
            const tokenString = this.stream.substring(offset)
            if (tokenString === 'true' || tokenString === 'false') {
                return this.finishToken(offset, SyntaxKind.BooleanKeyword)
            }
            if (tokenString === 'in' || tokenString === 'IN') {
                return this.finishToken(offset, SyntaxKind.CommaToken)
            }
            // function?
            let kind: SyntaxKind
            if (this.functions.includes[tokenString]) {
                kind = SyntaxKind.Function
            }
            // accessor?
            const accessorIndex = tokenString.indexOf('.')
            if (accessorIndex > 0) {
                // check that it doesn't end with a hanging period
				if (tokenString[tokenString.length - 1] === '.') {
                    this.error(`Hanging accessor on token ${tokenString}`, offset)
				}
                kind = SyntaxKind.Accessor
                const splits = tokenString.split('.')
				
                // check that none of them are unexported
				for (let i = 1; i < splits.length; i++) {
					const firstCharacter = splits[i]
                    if (firstCharacter.toUpperCase() !== firstCharacter) {
                        this.error(`Unable to access unexported field '${splits[i]}' in token '${tokenString}'`, offset)
                    }
				}
                return this.finishToken(offset, SyntaxKind.Accessor)
            }
        }

        if (isQuote(ch)) {
            this.stream.advance(1)
            let completed = false
            this.stream.advanceWhileChar(ch => {
                if (isQuote(ch)) {
                    completed = true
                    return false
                }
                return true
            })
            if (!completed) {
                this.error('Unclosed string literal', offset)
			}
            return this.finishToken(offset, SyntaxKind.StringLiteral)
        }

        // modifier and logical
        if (ch === CharacterCodes.openParen) {
            return this.finishToken(offset, SyntaxKind.OpenParenToken)
        }
        if (ch === CharacterCodes.closeBracket) {
            return this.finishToken(offset, SyntaxKind.CloseParenToken)
        }
        if (ch === CharacterCodes.plus) {
            if (this.stream.peekChar(1) === CharacterCodes.plus) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.PlusPlusToken)
            }
            return this.finishToken(offset, SyntaxKind.PlusToken)
        }
        if (ch === CharacterCodes.minus) {
            if (this.stream.peekChar(1) === CharacterCodes.minus) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.MinusMinusToken)
            }
            return this.finishToken(offset, SyntaxKind.MinusToken)
        }
        if (ch === CharacterCodes.asterisk) {
            return this.finishToken(offset, SyntaxKind.AsteriskToken)
        }
        if (ch === CharacterCodes.slash) {
            if (this.stream.peekChar(1) === CharacterCodes.asterisk) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.AsteriskAsteriskToken)
            }
            return this.finishToken(offset, SyntaxKind.SlashToken)
        }
        if (ch === CharacterCodes.percent) {
            return this.finishToken(offset, SyntaxKind.PercentToken)
        }
        if (ch === CharacterCodes.ampersand) {
            if (this.stream.peekChar(1) === CharacterCodes.ampersand) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.AmpersandAmpersandToken)
            }
            return this.finishToken(offset, SyntaxKind.AmpersandToken)
        }
        if (ch === CharacterCodes.bar) {
            if (this.stream.peekChar(1) === CharacterCodes.bar) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.BarBarToken)
            }
            return this.finishToken(offset, SyntaxKind.BarToken)
        }
        if (ch === CharacterCodes.caret) {
            return this.finishToken(offset, SyntaxKind.CaretToken)
        }

        // comparator
        if (ch === CharacterCodes.equals) {
            if (this.stream.peekChar(1) === CharacterCodes.equals) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.EqualsEqualsToken)
            }
            if (this.stream.peekChar(1) === CharacterCodes.tilde) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.EqualsTildeToken)
            }
        }
        if (ch === CharacterCodes.exclamation) {
            if (this.stream.peekChar(1) === CharacterCodes.equals) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.ExclamationEqualsToken)
            }
            if (this.stream.peekChar(1) === CharacterCodes.tilde) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.ExclamationTildeToken)
            }
        }
        if (ch === CharacterCodes.greaterThan) {
            if (this.stream.peekChar(1) === CharacterCodes.equals) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.GreaterThanEqualsToken)
            }
            if (this.stream.peekChar(1) === CharacterCodes.greaterThan) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.GreaterThanGreaterThanToken)
            }
            return this.finishToken(offset, SyntaxKind.GreaterThanToken)
        }
        if (ch === CharacterCodes.lessThan) {
            if (this.stream.peekChar(1) === CharacterCodes.equals) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.LessThanEqualsToken)
            }
            if (this.stream.peekChar(1) === CharacterCodes.lessThan) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.LessThanLessThanToken)
            }
            return this.finishToken(offset, SyntaxKind.LessThanToken)
        }
        if (ch === CharacterCodes.i) {
            if (this.stream.peekChar(1) === CharacterCodes.n) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.InToken)
            }
        }

        // ternary
        if (ch === CharacterCodes.question) {
            if (this.stream.peekChar(1) === CharacterCodes.question) {
                this.stream.advance(1)
                return this.finishToken(offset, SyntaxKind.QuestionQuestionToken)
            }
            return this.finishToken(offset, SyntaxKind.QuestionToken)
        }
        if (ch === CharacterCodes.colon) {
            return this.finishToken(offset, SyntaxKind.ColonToken) 
        }
    
        return this.finishToken(offset, SyntaxKind.Unknown)
	}

    finishToken(offset: number, type: SyntaxKind, text?: string): IToken {
		return {
			offset: offset,
			len: this.stream.pos() - offset,
			type: type,
			text: text || this.stream.substring(offset)
		}
	}

    private _whitespace(): boolean {
		const n = this.stream.advanceWhileChar(ch => {
            return [
                CharacterCodes.tab,
                CharacterCodes.lineFeed,
                CharacterCodes.verticalTab,
                CharacterCodes.formFeed,
                CharacterCodes.carriageReturn,
                CharacterCodes.space
            ].includes(ch)
        })
		return n > 0
	}
}
