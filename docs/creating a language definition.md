# Monaco 编辑器支持新的语言

## 创建语言定义

语言定义是描述语言各种属性的 JSON 数据。属性包括：

* ignoreCase（可选，默认为 `false`，boolean 类型），语言是否区分大小写。词法分析器中的正则表达式依赖该值进行大小写匹配。

* defaultToken（可选，默认为 `"source"`，string 类型）。为没有被词法分析器匹配到单词提供默认值。在语法高亮的开发过程中，将其设置为 `"invalid"`，便于发现未被匹配的内容。

* brackets（可选，定义括号的数组）词法分析器用它来匹配括号。参考 `@brackets` 和 `bracket` 来获取更多信息。每个括号定义都是一个由3个元素组成的数组或对象，用于描述 `open` 左括号、`close` 右括号和 `token` 类型。默认定义为：

```js
[   ['{','}','delimiter.curly'],
    ['[',']','delimiter.square'],
    ['(',')','delimiter.parenthesis'],
    ['<','>','delimiter.angle'] ]
```

* tokenizer（必需，定义词法分析中的各个状态的对象）用于定义词法分析规则 —— 详细描述，请参见下一节。

本文档后面的高级属性部分介绍了更多可以可用的属性。

## 创建词法分析器

`tokenizer` 属性描述如何进行词法分析，从输入字符流中生成单词。每个单词都有一个 CSS 类名，用于在编辑器的渲染。标准的 CSS 类名有：

```
identifier         entity           constructor
operators          tag              namespace
keyword            info-token       type
string             warn-token       predefined
string.escape      error-token      invalid
comment            debug-token
comment.doc        regexp
constant           attribute

delimiter .[curly,square,parenthesis,angle,array,bracket]
number    .[hex,octal,binary,float]
variable  .[name,value]
meta      .[content]
```

### 状态

词法分析器由一个对象构成，其中定义词法分析中的各个状态。初始状态词法分析器中定义的第一个状态。当词法分析器处于一个确定状态时，仅会采用该状态下的规则。按顺序匹配所有的规则，匹配到的第一个规则将决定单词的类型。

（进阶）一个状态可以使用点（.）来拆分出子状态。在匹配一个状态下的规则时，词法分析器首先尝试整个状态名，然后是其父状态名，直到匹配成功。例如，在我们的示例中，状态 `"comment.block"` 和 `"comment.foo"` 均被 `comment` 状态下的规则处理。层级化的状态名可以用于管理复杂的词法分析器状态。

### 规则

每个状态都定义了一组规则，用于匹配输入。规则可被定义为以下形式：

* [regex, action] `{ regex: regex, action: action }` 的简写。

* [regex, action, next] `{ regex: regex, action: action{next: next} }` 的简写。

* {regex: regex, action: action } 当正则表达式与当前输入匹配时，`action` 用于决定单词的类型。`regex` 可以是一个正则表达式（使用 `/regex/`）或一个代表正则表达式的字符串。如果表达式以 `^` 字符开头，将仅从行的开头进行匹配。`$` 用于匹配行的结尾。注意，当已经到达行的结尾时，不会调用词法分析器，所以 `$` 永远不会被匹配（参见 `'@eos'`）。在正则表达式中，你可以使用 `@attr` 来引用名为 `attr` 的 string 类型属性，它会自动展开。

* { include: state } 这是预先扩展的，对性能没有影响。例如，许多示例中都包括 `'@whitespace'` 状态。

### 操作

操作决定单词最终的类型。操作可被定义为以下形式：

* string `{ token: string }` 的简写。

* \[action1,...,actionN\]

    * { token: tokenclass }

    * "@brackets" 或

    * "@brackets.tokenclass

    * "@rematch"

    * next: state

    * "@pop"

    * "@push"

    * "@popall"

* next: state

* switchTo: state

* goBack: number

* bracket: kind

* nextEmbedded: langId or '@pop'

* log: message

* { cases: { guard1: action1, ..., guardN: actionN } }

## 进阶：复杂的括号匹配

## 进阶：语言定义中的其他属性

## 单词检查工具

Monaco 在浏览器中提供了一个 `Inspect Tokens` 工具，帮助识别从源代码中解析出的单词。

激活方式：

1. 焦点位于 Monaco 实例时按 F1
2. 触发 `Developer: Inspect Tokens` 选项

这将展示所选单词的所属语言、单词类型、基本字体样式，和可以在编辑器主题中使用的选择器。

## 参考链接

[Monarch Documentation](https://microsoft.github.io/monaco-editor/monarch.html)
