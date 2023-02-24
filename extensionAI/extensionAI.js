const vscode = require('vscode');
const child_process = require('child_process');
const openai = require('openai');

async function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.autoCommit', async function () {
    const gitPath = vscode.workspace.getConfiguration().get('git.path');
    const repoPath = vscode.workspace.rootPath;
    const openaiApiKey = vscode.workspace.getConfiguration().get('autoCommit.openaiApiKey');
    const commitMessage = await generateCommitMessage(openaiApiKey);

    if (gitPath && repoPath && commitMessage) {
      const gitStatus = child_process.spawnSync(gitPath, ['status', '--porcelain'], { cwd: repoPath });

      if (gitStatus.status === 0) {
        const changes = gitStatus.stdout.toString().trim();

        if (changes) {
          const commitCommand = `${gitPath} commit -m "${commitMessage}"`;
          const commit = child_process.spawnSync(commitCommand, { cwd: repoPath });

          if (commit.status === 0) {
            vscode.window.showInformationMessage('Changes committed successfully!');
          } else {
            vscode.window.showErrorMessage(`Error committing changes: ${commit.stderr.toString().trim()}`);
          }
        } else {
          vscode.window.showInformationMessage('No changes to commit!');
        }
      } else {
        vscode.window.showErrorMessage(`Error checking git status: ${gitStatus.stderr.toString().trim()}`);
      }
    } else {
      vscode.window.showErrorMessage('Missing configuration values: git.path, autoCommit.openaiApiKey, or no open workspace!');
    }
  });

  context.subscriptions.push(disposable);
}

async function generateCommitMessage(apiKey) {
  const prompt = "Please summarize the changes you just made:";
  const model = "text-davinci-002";
  const maxTokens = 60;
  const temperature = 0.5;

  openai.apiKey = apiKey;

  const gptResponse = await openai.complete({
    prompt: prompt,
    model: model,
    maxTokens: maxTokens,
    temperature: temperature
  });

  return gptResponse.choices[0].text.trim();
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
