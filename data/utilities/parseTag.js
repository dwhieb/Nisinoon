const grammaticalRegExp = /^([A-Z+\-\(\)]|\s)+$/v

export default function parseTag(rawTag) {

  const grammatical = grammaticalRegExp.test(rawTag)
  const tag         = grammatical ? rawTag.toLowerCase() : rawTag

  return {
    grammatical,
    tag,
  }

}
