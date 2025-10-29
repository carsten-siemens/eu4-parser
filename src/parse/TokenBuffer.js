export class TokenBuffer {
  constructor() {
    this.head = null;
    this.cursor = null;
    this.tail = null;  
  }

  push(data) {
    const node = { data: data, next: null};

    if (this.head) {
      this.tail.next = node;
    } else {
      this.head = node;
      this.cursor = node;
    }
 
    this.tail = node;
  }

  hasTokens() {
    return this.cursor != null
  }

  peekToken(offset = 0) {
    let tempCursor = this.cursor;

    for(let i=0; tempCursor && (i < offset); i++) {
      tempCursor = tempCursor.next;
    }
    
    return tempCursor 
      ? tempCursor.data 
      : null;
  }

  consumeToken() {
    if (this.cursor) {
      let data =  this.cursor.data;
      this.cursor = this.cursor.next;

      return data;
    }

    return null;
  }

  *[Symbol.iterator]() {
    let current = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }
}