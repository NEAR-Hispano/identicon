const getAttribute = (attributes, attributeName) => {
  for (const att of attributes) {
    if (att.Name === attributeName) {
      return att;
    }
  }
  return null;
};

const removeAttribute = (attributes, attributeName) => {
  return attributes.filter( attr => {
    if (attr.Name === attributeName) return false;
    return true;
  });
};

module.exports = { getAttribute, removeAttribute };