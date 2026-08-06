export const lazyLoad = (importFn) => {
  return async () => {
    const { default: Component, ...rest } = await importFn();
    return { Component, ...rest };
  };
};