const vscode = require('vscode');
const child_process = require('child_process');

function activate(context) {
  let disposable = vscode.commands.registerCommand('extension.autoCommit', function () {
    const gitPath = vscode.workspace.getConfiguration().get('git.path');
    const repoPath = vscode.workspace.rootPath;
    const commitMessage = vscode.workspace.getConfiguration().get('autoCommit.message');

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
      vscode.window.showErrorMessage('Missing configuration values: git.path, autoCommit.message, or no open workspace!');
    }
  });

  context.subscriptions.push(disposable);
}

exports.activate = activate;

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
