// config file
const { NODE_ENV, BasePath, DefaultTitle } = process.env
const GatewayBasePath = '/'

const config = {
  NODE_ENV,
  BasePath,
  DefaultTitle,
  GatewayBasePath,
}

export default config

export { BasePath, DefaultTitle, GatewayBasePath, NODE_ENV }
