import { TokenBuffer } from "./TokenBuffer.js";

export class Parser {

  parse(tokens, o={}) {
    let tb = new TokenBuffer(tokens);
    this.#checkFormatInfo(tb);
    this.#parseAny(tb, o, []);

    return o;
  }

  #checkFormatInfo(tb) {
    const expected = "EU4txt";
    let token = tb.consumeToken();
    let value = token.getObject();

    if (value.toLowerCase() != expected.toLowerCase()) {
      throw `ERROR: ${token.getPosition().toString()} File starts with "${value}" instead of "${expected}"`;
    }
  }

  #parseAny(tb, o, breadcrumb) {
    let keyToken = null;

    while ((keyToken = tb.consumeToken()) && !keyToken.isBlockEndToken()) {

      if (!keyToken.isValueToken()) {
        // Workaround for EU4 issue where {} occurs instead of a value token.
        // Example: technology_group=western {} {}
        // Therefore, we ignore {} if we find it were we expect a value token

        if (keyToken.isBlockStartToken() && tb.peekToken().isBlockEndToken) {
          tb.consumeToken();
          continue;
        }

        throw `Error: ${keyToken.getPosition().toString()} Value token expected`;
      }

      let separatorToken = tb.consumeToken();

      // In rare cases - e.g "map_area_data" - the "=" is omitted before "{".
      // Example: "<key>{" instead of "<key>={"
      // Therefore, we accept both patterns.
      let rightToken = null;
      if (separatorToken.isBlockStartToken()) {
        rightToken = separatorToken;
      } else {
        if (!separatorToken.isSeparatorToken()) {
          throw `Erorr: ${separatorToken.getPosition().toString()} Separator token expected`;
        }

        rightToken = tb.consumeToken();
        if (!rightToken) {
          throw `Erorr: Unexpected end-of-token`;
        }
     }

      let key = keyToken.getObject();
      let value = this.#parseAnyRightHandside(tb, rightToken, `breadcrumb / ${key}`);

      if (value == null) {
        throw `ERROR: ${keyToken.getPosition().toString()} unable to parse token: "${rightToken}"`
      }

      o[key] = value;
    }

    return o;
  }

  #parseAnyRightHandside(tb, rightToken, breadcrumb) {
    let value = null;

    if ((value = this.#tryParseAttribute(tb, rightToken, breadcrumb)) != null) {
      return value;
    }

    if (value = this.#tryParseComplexType(tb, rightToken, breadcrumb)) {
      return value
    }

    if (value = this.#tryParseArray(tb, rightToken, breadcrumb)) {
      return value;
    }

    return value;
  }

  #tryParseAttribute(tb, rightToken, breadcrumb) {
    return rightToken.isValueToken()
      ? rightToken.getObject()
      : null;
  }

  #tryParseComplexType(tb, rightToken, breadcrumb) {
    let isCompplexType = rightToken.isBlockStartToken()
      && tb.peekToken().isValueToken()
      && tb.peekToken(1).isSeparatorToken();

    let result = isCompplexType
      ? this.#parseAny(tb, {}, breadcrumb)
      : null;

    return result;
  }

  #tryParseArray(tb, rightToken, breadcrumb) {
    let peek = tb.peekToken();
    let peek1 = tb.peekToken(1);
    if (!rightToken.isBlockStartToken() || peek1?.isSeparatorToken() || peek?.isSeparatorToken()) {
      return null;
    }

    let arr = [];
    let item = null;
    while ((item = tb.consumeToken()) && !item.isBlockEndToken()) {
      let value = this.#parseAnyRightHandside(tb, item, `${breadcrumb} / []`);
      arr.push(value);
    }

    return arr;
  }

}