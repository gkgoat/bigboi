class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
//oh god good luck I can't do this at all

class Lexer {
  constructor(str) {
    this.pos = 0;
    this.source = str;
  }

  eat() {
    let ch = this.source[this.pos];

    this.pos++;

    return ch;
  }

  peek() {
    let ch = this.source[this.pos];

    return ch;
  }

  space() {
    while (this.peek() == ' ') {
      this.eat();
    }
  }

  ident() {
      let result = "";

      while (this.peek() != ' ') {
          result += this.eat();
      }

      return new Token("Ident", result);
  }

  string() {
    this.eat();

    let result = "";
    // note to self revisit this later in case of infinite loop problems
    while (this.peek() != '"') {
        result += this.eat();
    }

    return new Token("String", result);
  }

  isnum(str) {

      if (str == '.')
        return true;

      try {
        if (! parseFloat(str))
            return false;
        return true;
      }
      catch (e) {
          return false;
      }
  }

  number() {
      let result = "";

      while (this.isnum(this.peek())) {
          result += this.eat();
      }

      return new Token("Number", result);
  }

  next() {
    this.space();

    if (this.peek() == '"') {
      return this.string();
    }

    if (this.isnum(this.peek())) {
        return this.number();
    } 

    return this.ident();
  }

  peektok() {
      let prev = this.pos;
      let value = this.next();
      this.pos = prev;
      return value; // javascript of course
  }

}

class Parser {
    constructor(str) {
        this.lex = new Lexer(str);
        this.stack = [];
    }

    statement() {
        return this.add();
    }

    add() {

        let next;
        let peek;

        if (this.stack.length > 0) {
            next = this.stack.pop();
            peek = this.lex.peektok();
        }
        else {
           next = this.lex.next();
           peek = this.lex.peektok();
        }

        if (peek.value == "+") {
            this.lex.next();
            let rig = this.lex.next();
            if (this.lex.peektok().value == "+") {
                this.stack.push({ left: next, op: peek, right: rig });
                return this.add();
            }
            return { left: next, op: peek, right: rig };
        }
    }
}

let inp = document.getElementById("input");
let run = document.getElementById("dothings");

run.onclick = function() {
    let parser = new Parser(inp.value);

    console.log(parser.statement());
}