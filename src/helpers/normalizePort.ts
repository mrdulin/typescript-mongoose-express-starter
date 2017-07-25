type Port = string | number | boolean;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): Port {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
}

export {
  Port
};
export default normalizePort;
