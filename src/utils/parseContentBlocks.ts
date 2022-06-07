const parseContentBlocks = <T extends Record<string, any>>(
  cbR: Record<string, any>,
): Partial<T> => {
  const contentMap = {};
  Object.entries(cbR).forEach(([_, cbList]) => {
    if (Array.isArray(cbList)) {
      cbList.forEach(cb => {
        if (cb?.__typename?.match(/^WebPageContentBlock/) && 'name' in cb) {
          contentMap[cb.name] = cb;
        }
      });
    }
  });

  return contentMap as T;
};

export default parseContentBlocks;
