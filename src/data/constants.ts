export const BACKEND_DEFAULT_PORT = 5392;
export const NODES_REPO = "https://github.com/flojoy-ai/nodes/blob/main";
export const DOCS_LINK = "https://docs.flojoy.ai";
const BACKEND_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
const BACKEND_PORT = process.env.VITE_BACKEND_PORT
  ? +process.env.VITE_BACKEND_PORT
  : 5392;
export const API_URI = "http://" + BACKEND_HOST + ":" + BACKEND_PORT;
const SOCKET_HOST = process.env.VITE_SOCKET_HOST || "127.0.0.1";
export const SOCKET_URL = `ws://${SOCKET_HOST}:${BACKEND_PORT}/ws`;
export const REQUEST_NODE_URL = "https://toqo276pj36.typeform.com/to/F5rSHVu1";
export const IS_CLOUD_DEMO =
  process.env.IS_CLOUD_DEMO?.toLowerCase() === "true";
