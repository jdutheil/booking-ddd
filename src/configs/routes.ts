// Root
const authRoot = 'auth';
const bookersRoot = 'bookers';
const contactsRoot = 'contacts';
const organizersRoot = 'organizers';

// Api versions
const v1 = 'v1';

export const routesV1 = {
  version: v1,
  auth: {
    root: authRoot,
    signin: `signin`,
  },
  booker: {
    root: bookersRoot,
  },
  contact: {
    root: contactsRoot,
  },
  organizer: {
    root: organizersRoot,
  },
};
