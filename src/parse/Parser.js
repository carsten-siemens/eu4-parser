export class Parser {
  constructor(tokens) {
    this.i = 0;
    this.tokens = tokens;
    this.iMax = this.tokens.length;
  }

  parse(o={}) {
    this.#checkFormatInfo();
    this.#parseAny(o, []);

    return o;
  }

  #checkFormatInfo() {
    const expected = "EU4txt";
    let value = this.#getToken().getObject();

    if (value.toLowerCase() != expected.toLowerCase()) {
      throw `ERROR: File starts with "${value}" instead of "${expected}"`;
    }
  }

  #parseAny(o, breadcrumb) {
    let keyToken = null;

    while ((keyToken = this.#getToken()) && !keyToken.isBlockEndToken()) {

      if (!keyToken.isValueToken()) {
        // Workaround for EU4 issue where {} occurs instead of a value token.
        // Example: technology_group=western {} {}
        // Therefore, we ignore {} if we find it were we expect a value token

        if (keyToken.isBlockStartToken() && this.#peekToken().isBlockEndToken) {
          this.#skipToken();
          continue;
        }

        throw `Error: Value token expected`;
      }

      let separatorToken = this.#getToken();

      // In rare cases - e.g "map_area_data" - the "=" is omitted before "{".
      // Example: "<key>{" instead of "<key>={"
      // Therefore, we accept both patterns.
      let rightToken = null;
      if (separatorToken.isBlockStartToken()) {
        rightToken = separatorToken;
      } else {
        if (!separatorToken.isSeparatorToken()) {
          throw `Erorr: Separator token expected`;
        }

        rightToken = this.#getToken();
        if (!rightToken) {
          throw `Erorr: Unexpected end-of-token`;
        }
     }

      let key = keyToken.getObject();
      let value = this.#parseAnyRightHandside(rightToken, `breadcrumb / ${key}`);

      if (value == null) {
        throw `ERROR: unable to parse token: "${rightToken}"`
      }

      o[key] = value;
    }

    return o;
  }

  #parseAnyRightHandside(rightToken, breadcrumb) {
    let value = null;

    if ((value = this.#tryParseAttribute(rightToken, breadcrumb)) != null) {
      return value;
    }

    if (value = this.#tryParseComplexType(rightToken, breadcrumb)) {
      return value
    }

    if (value = this.#tryParseArray(rightToken, breadcrumb)) {
      return value;
    }

    return value;
  }

  #tryParseAttribute(rightToken, breadcrumb) {
    return rightToken.isValueToken()
      ? rightToken.getObject()
      : null;
  }

  #tryParseComplexType(rightToken, breadcrumb) {
    let isCompplexType = rightToken.isBlockStartToken()
      && this.#peekToken().isValueToken()
      && this.#peekToken(1).isSeparatorToken();

    let result = isCompplexType
      ? this.#parseAny({}, breadcrumb)
      : null;

    return result;
  }

  #tryParseArray(rightToken, breadcrumb) {
    let peek1 = this.#peekToken(1);
    if (!rightToken.isBlockStartToken() || peek1.isSeparatorToken()) {
      return null;
    }

    let arr = [];
    let item = null;
    while ((item = this.#getToken()) && !item.isBlockEndToken()) {
      let value = this.#parseAnyRightHandside(item, `${breadcrumb} / []`);
      arr.push(value);
    }

    return arr;
  }

  #peekToken(offset = 0) {
    let index = this.i + offset;
    return index < this.iMax
      ? this.tokens[index]
      : null;
  }

  #getToken(offset = 0) {
    let token = this.#peekToken(offset);
    this.i += offset + 1;

    return token;
  }

  #skipToken(offset = 0) {
    this.i += offset + 1;
  }

}