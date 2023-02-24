const { workspace } = require("vscode");
const openai = require("openai");

async function generateCommitMessage(changes) {
  const prompt = `Resumir los cambios realizados en un proyecto:`;
  const completions = await openai.completions.create({
    engine: "davinci-codex",
    prompt,
    max_tokens: 128,
    n: 1,
    stop: "\n",
    temperature: 0.5,
  });

  const message = `${completions.choices[0].text.trim()}\n\n${changes}`;
  return message;
}

function getGitChanges() {
  const rootPath = workspace.rootPath;
  const diff = execSync(`git diff --name-only`, { cwd: rootPath }).toString();
  const changes = diff.trim().split("\n");
  return changes.join(", ");
}

module.exports = {
  generateCommitMessage,
  getGitChanges,
};


/*
Este archivo contiene dos funciones.

La primera función generateCommitMessage utiliza la API de OpenAI para generar un mensaje de confirmación de Git resumiendo los cambios realizados en el proyecto. La función toma como entrada una cadena que contiene los cambios realizados en el proyecto y utiliza esta cadena como punto de partida para la generación del mensaje de confirmación. La función utiliza el modelo de lenguaje davinci-codex para generar el mensaje y devuelve el mensaje generado.

La segunda función getGitChanges es la misma función que se encuentra en el archivo utils.js en la versión que no utiliza la API de OpenAI. La función utiliza el comando git diff para obtener una lista de los archivos que han sido modificados desde el último commit en el proyecto y devuelve una cadena que contiene los nombres de los archivos modificados.
*/