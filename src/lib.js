const writeContent = function (content, file) {
  fs.writeFileSync(file, content, 'utf8');
}

const getParams = searchParams => {
  const params = {};
  for ([key, value] of searchParams.entries()) {
    params[key] = value
  }
  return params;
};

module.exports = { writeContent, getParams };
