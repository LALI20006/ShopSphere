import serverModule from "../server/dist/index.js";

const app = serverModule.default?.default || serverModule.default || serverModule;

export default function handler(req, res) {
  return app(req, res);
}
