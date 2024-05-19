/**
 * Generates the issue link for the requested page.
 */

const newIssueURL = `https://github.com/dwhieb/Nisinoon/issues/new`

export default function createIssueLink(req, res, next) {

  const requestURL = new URL(req.url, `${ req.protocol }://${ req.hostname }`).toString()

  const params = {
    body:   `**URL where issue was encountered:**\n${ requestURL }`,
    labels: `🐞 bug`,
  }

  const querystring = new URLSearchParams(params).toString()
  res.locals.issueLink = `${ newIssueURL }?${ querystring }`
  next()

}
