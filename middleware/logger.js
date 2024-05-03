export default function logger(req, res, next) {
  console.info(`${ (new Date).toString() }: ${ req.method } ${ req.originalUrl }`)
  next()
}
