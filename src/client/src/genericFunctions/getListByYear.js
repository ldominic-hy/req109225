export const getListByYear = (year, fullList) => {
  const features = fullList?.features;
  let result = [];
  if (features && typeof features === 'object') {
    features.forEach(item => {
      if (item?.properties?.FIRE_YEAR === year) {
        result.push(item);
      }
    });
  }
  return result;
};
