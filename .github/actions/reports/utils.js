import core from "@actions/core";
import github from "@actions/github";
import * as markdownTable from "markdown-table";
import { deleteComment } from "@aki77/actions-replace-comment";
import replaceComment from "@aki77/actions-replace-comment";

export function getExamples(results) {
  return getChildren(results, []);
}

function getChildren(input, output, filepath) {
  Object.values(input).forEach(({ tests, suites, file }) => {
    if (file) {
      filepath = file;
    }

    if (tests) {
      tests.forEach(
        ({ fail, pending, skipped, fullTitle, err: { message } }) => {
          if (fail || pending || skipped) {
            output.push({
              title: fullTitle,
              filepath,
              message: message ? message.replace(/\n+/g, " ") : null,
              state: fail ? "fail" : skipped ? "skipped" : "pending",
            });
          }
        }
      );
    }

    if (suites) {
      output = [...getChildren(suites, output, filepath)];
    }
  });

  return output;
}

export function getTable(examples) {
  return markdownTable([
    ["State", "Description"],
    ...examples.map(({ state, filepath, title, message }) => [
      state,
      `**Filepath**: ${filepath}<br>**Title**: ${title}<br>**Error**: ${message}`,
    ]),
  ]);
}

export function getSummary(stats) {
  return (
    `Passes: ${stats.passes},` +
    ` failures: ${stats.failures},` +
    ` pending: ${stats.pending},` +
    ` skipped: ${stats.skipped},` +
    ` other: ${stats.other}.`
  );
}

function pullRequestId() {
  const pullRequestId = github.context.issue.number;
  if (!pullRequestId) {
    throw new Error("Cannot find the pull request ID.");
  }
  return pullRequestId;
}

const commentGeneralOptions = () => {
  return {
    token: core.getInput("token", { required: true }),
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: pullRequestId(),
  };
};

export async function report(result) {
  const title = core.getInput("title", { required: true });
  const always = core.getInput("always", { required: true });

  if (!result.stats.failures && !always) {
    await deleteComment({
      ...commentGeneralOptions(),
      body: title,
      startsWith: true,
    });
    return;
  }

  await replaceComment({
    ...commentGeneralOptions(),
    body: `${title}
<details>
<summary>${getSummary(result.stats)}</summary>

${getTable(getExamples(result.results))}

</details>
`,
  });
}