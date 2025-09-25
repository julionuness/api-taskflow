const getById = (array, id) => {
  return array.find(item => item.id === parseInt(id));
};

const findByProperty = (array, property, value) => {
  return array.find(item => item[property] === value);
};

const filterByProperty = (array, property, value) => {
  return array.filter(item => item[property] === value);
};

const generateId = (array) => {
  if (array.length === 0) return 1;
  return Math.max(...array.map(item => item.id)) + 1;
};

module.exports = {
  getById,
  findByProperty,
  filterByProperty,
  generateId
};