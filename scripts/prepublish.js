const fs = require("fs");

const deleteDir = path => {
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach(i => {
      const currentPath = `${path}/${i}`;
      if (fs.statSync(currentPath).isDirectory()) {
        deleteDir(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(path);
  }
};

console.log("start pre-cleanning");
deleteDir("./dist");
deleteDir("./min");
console.log("pre-cleanning done");
