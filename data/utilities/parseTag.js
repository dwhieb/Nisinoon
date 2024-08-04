const grammaticalRegExp = /^([A-Z+\-\(\)]|\s)+$/v

export default function parseTag(tag) {
  return {
    grammatical: grammaticalRegExp.test(tag),
    tag,
  }
}
