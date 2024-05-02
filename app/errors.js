export default function handleUncaughtException(err) {
  console.error((new Date).toUTCString(), `Uncaught Exception:`, err.message)
  console.error(err.stack)
  process.exit(1)
}
