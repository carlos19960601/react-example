export const assertExists = (val, message) => {
  if (val === null || val === undefined) {
    throw new Error(message);
  }
};
