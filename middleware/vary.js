import vary from 'vary'

export default function middleware(req, res, next) {
  vary(res, `Upgrade-Insecure-Requests`)
  next()
}
