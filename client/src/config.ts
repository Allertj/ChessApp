let host = window.location.host
let protocol = window.location.protocol
let corehost = host.substring(0, host.indexOf(':'));
const port = process.env.REACT_APP_BACKEND_PORT

const server = `${protocol}//${corehost}:${port}`

export { server } 