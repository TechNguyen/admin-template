const HTTP_STATUS = Object.freeze({
  BAD_RERQUEST: 400,
  OK_RESPONSE: 200,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  TOO_MANY_REQUEST: 429,
  SERVER_ERROR: 500
});

//build
// const PROTOCOL = 'http';
// const HOST = '192.168.132.1';
// const PORT = '8051';
// const VERSION = 'v1';
//devlopement
const PROTOCOL = 'http';
const HOST = 'localhost';
const PORT = '3000';

export { PORT, PROTOCOL, HOST, HTTP_STATUS };
