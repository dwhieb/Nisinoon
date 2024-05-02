export function OK(req, res) {
  res.send(`Nisinoon`)
}

export function PageNotFound(req, res) {

  if (req.method !== `GET`) {
    res.set(`Allow`, `GET`)
    return res.sendStatus(405)
  }

  res.status(404)
  res.send(`Page Not Found`)

}

export function ServerError(err, req, res, next) {
  console.error((new Date).toUTCString(), `Server Error:`, err.message)
  console.error(err.stack)
  res.status(500)
  res.send(`Server Error`)
}
