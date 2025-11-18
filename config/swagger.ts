// for AdonisJS v6
import path from "node:path";
import url from "node:url";
// ---

export default {
  // path: __dirname + "/../", for AdonisJS v5
  path: path.dirname(url.fileURLToPath(import.meta.url)) + "/../", // for AdonisJS v6
  tagIndex: 1,
  productionEnv: "production", // optional
  info: {
    title: "Devices API",
    version: "1.0.0",
    description: "An API to manage devices with AdonisJS",
  },
  snakeCase: true,
  debug: false, // set to true, to get some useful debug output
  ignore: ["/swagger", "/docs"],
  preferredPutPatch: "PUT", // if PUT/PATCH are provided for the same route, prefer PUT
  common: {
    parameters: {}, // OpenAPI conform parameters that are commonly used
    headers: {}, // OpenAPI conform headers that are commonly used
  },
  persistAuthorization: false, // persist authorization between reloads on the swagger page
  showFullPath: false, // the path displayed after endpoint summary
};