// Root
const authRoot = 'auth';
const bookersRoot = 'bookers';

// Api versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  auth: {
    root: authRoot,
    signin: `${authRoot}/signin`,
  },
  booker: {
    root: bookersRoot,
  },
};
