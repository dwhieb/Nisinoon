export function PageNotFound(req, res) {

  if (req.method !== `GET`) {
    res.set(`Allow`, `GET`)
    return res.sendStatus(405)
  }

  const status = 404

  res.status(status)

  res.render(`Error/Error`, {
    cssClass: `error`,
    Error:    true,
    message:  `This page does not exist.`,
    status,
    title:    `Page Not Found`,
  })

}

export function ServerError(err, req, res, next) {

  console.error((new Date).toUTCString(), `Server Error:`, err.message)
  console.error(err.stack)

  const status = 500

  res.status(status)

  res.render(`Error/Error`, {
    cssClass: `error`,
    Error:    true,
    message:  `Please consider <a class=link href='{{ issueLink }}'>opening an issue on GitHub</a> to report this error.`,
    status,
    title:    `Server Error`,
  })

}

export function ServerErrorTest() {
  throw new Error(`Server Error Test`)
}
