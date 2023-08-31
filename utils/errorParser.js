function errorParser(error) {
  if (Array.isArray(error)) {
    return error.map(e => e.msg);
  } else if (error.name == 'Validator Error!') {
    return Object.values(error.errors).map(v => v.message);
  } else {
    return [error.message];
  }
}

module.exports = errorParser;