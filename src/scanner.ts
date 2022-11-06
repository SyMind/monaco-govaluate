export enum TokenType {
	Unknown,

	Prefix,
	Numeric,
	Boolean,
	String,
	Pattern,
	Time,
	Variable,
	Function,
	Separator,
	Accessor,

	Comparator,
	Logicalop,
	Modifier,

	Clause,
	Clause_close,

	Ternary,

    EOF
}

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

enum CharacterCodes {
    // Unicode's White Space
    tab = 0x09,                   // \t
    lineFeed = 0x0A,              // \n
    verticalTab = 0x0B,           // \v
    formFeed = 0x0C,              // \f
    carriageReturn = 0x0D,        // \r
    space = 0x0020,               // " "

    a = 0x61,
    f = 0x66,
    x = 0x78,

    _0 = 0x30,
    _9 = 0x39,

    comma = 0x2C,                 // ,
    dot = 0x2E,                   // .
    openBracket = 0x5B,           // [
    closeBracket = 0x5D,          // ]
}

function isDigit(ch: number): boolean {
    return ch >= CharacterCodes._0 && ch <= CharacterCodes._9
}

function isHexDigit(ch: number): boolean {
    return isDigit(ch) || ch >= CharacterCodes.a && ch <= CharacterCodes.f
}

export interface IToken {
	type: TokenType
	text: string
	offset: number
	len: number
}

export class Scanner {
    stream = new MultiLineStream('')
	ignoreComment = true
	ignoreWhitespace = true
	inURL = false

    setSource(input: string): void {
		this.stream = new MultiLineStream(input)
	}

    scan(): IToken {
		// processes all whitespaces
		this._whitespace()

		const offset = this.stream.pos()

		// End of file/input
		if (this.stream.eos()) {
			return this.finishToken(offset, TokenType.EOF)
		}
		return this.scanNext(offset)
	}

    scanNext(offset: number): IToken {
		// numeric constant
		if (this._numeric()) {
			return this.finishToken(offset, TokenType.Numeric)
		}

        // comma, separator
        if (this.stream.peekChar() === CharacterCodes.comma) {
            return this.finishToken(offset, TokenType.Separator)
        }

        // escaped variable
        // if (this.stream.peekChar() === CharacterCodes.openBracket) {
            
		// }
    
        return this.finishToken(offset, TokenType.Unknown)
	}

    finishToken(offset: number, type: TokenType, text?: string): IToken {
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

    private _numeric(): boolean {
		const ch = this.stream.peekChar()
        if (ch === CharacterCodes._0 && this.stream.peekChar(1) === CharacterCodes.x) {
            this.stream.advance(2)
            this.stream.advanceWhileChar(isHexDigit)
            return true
        } else if (ch >= CharacterCodes._0 && ch <= CharacterCodes._9 || ch === CharacterCodes.dot) {
            this.stream.advanceWhileChar(isDigit)
            return true
        }
        return false
    }
}
