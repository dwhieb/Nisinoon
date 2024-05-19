import helmet from 'helmet'

const config = { contentSecurityPolicy: { directives: { scriptSrc: [`'self'`, `'unsafe-inline'`] } } }

export default helmet(config)
