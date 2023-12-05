import * as process from "process";

let API_URL="http://localhost:3000";

if (process.env.API_URL) {
  API_URL = process.env.API_URL;
}

export {API_URL};
