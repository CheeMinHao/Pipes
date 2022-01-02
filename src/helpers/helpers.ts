const { Readable } = require('stream');
const fs = require('fs');

/**
 * @param binary Buffer
 * returns readableInstanceStream Readable
 */
export function bufferToStream(binary) {
  const readableInstanceStream = new Readable({
    read() {
      this.push(binary);
      this.push(null);
    },
  });

  return readableInstanceStream;
}

export function getRules(courseCode) {
  return JSON.parse(fs.readFileSync(`src/rules/${courseCode}.json`));
}
