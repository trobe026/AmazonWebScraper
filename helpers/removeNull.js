const removeNull = results => {
  Object.keys(results).forEach(function(key) {
    if (results[key] === '') {
      results[key] = 'Data Point Unavailable for Product'
    }
  });
  return results;
}

module.exports = removeNull;
