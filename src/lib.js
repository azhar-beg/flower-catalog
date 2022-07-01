const fs = require('fs');

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

const urlInstruction = () => '<div>api link: => http://localhost:8181/api?name=all&comment=all</div>';
const nameKeyInstruction = () => '<div>key:name -> get comments of specific users.</div>';
const commentKeyInstruction = () => "<div>key:comment -> get comments with specific content.</div>";

const instructions = { urlInstruction, nameKeyInstruction, commentKeyInstruction }

module.exports = { writeContent, getParams, ...instructions };
