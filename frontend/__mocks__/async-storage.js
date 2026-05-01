const store = {};

module.exports = {
  setItem: jest.fn((key, value) => {
    store[key] = value;
    return Promise.resolve(null);
  }),
  getItem: jest.fn((key) => Promise.resolve(store[key] ?? null)),
  removeItem: jest.fn((key) => {
    delete store[key];
    return Promise.resolve(null);
  }),
  clear: jest.fn(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    return Promise.resolve(null);
  }),
};
