const { workspace } = require("vscode");
const { execSync } = require("child_process");

function getGitChanges() {
  const rootPath = workspace.rootPath;
  const diff = execSync(`git diff --name-only`, { cwd: rootPath }).toString();
  const changes = diff.trim().split("\n");
  return `Se han realizado cambios en los siguientes archivos: ${changes.join(", ")}`;
}

module.exports = {
  getGitChanges,
};


/*
Este archivo contiene una función llamada getGitChanges que utiliza el comando git diff para obtener una lista de los archivos que han sido modificados desde el último commit en el proyecto. La función devuelve una cadena que contiene los nombres de los archivos modificados, que se utilizará en el archivo extension.js para crear un mensaje de confirmación de Git.
*/