const grammaticalRegExp = /^([A-Z+\-\(\)]|\s)+$/v

export default function parseTag(rawTag) {

  if (rawTag === `NG`) {
    return {
      grammatical: false,
      tag:         ``,
    }
  }

  const grammatical = grammaticalRegExp.test(rawTag)
  const tag         = grammatical ? rawTag.toLowerCase() : rawTag

  return {
    grammatical,
    tag,
  }

}
