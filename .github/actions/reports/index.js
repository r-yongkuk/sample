import core from "@actions/core";
import fs from "fs";
import path from "path";
import { report } from "./utils.js";

async function run() {
  try {
    const [_, __, pathname, token, title, always] = process.argv;
    console.log(process.argv);

    // const pathname = core.getInput("pathname", { required: true });
    // const token = core.getInput("token", { required: true });
    // const title = core.getInput("title", { required: true });
    // const always = core.getInput("always", { required: true });

    const fullPathname = path.resolve(process.env.GITHUB_WORKSPACE, pathname);

    try {
      fs.accessSync(fullPathname, fs.constants.R_OK);
    } catch (err) {
      core.warning(`${fullPathname}: access error! ${err}`);
      return;
    }

    const result = await import(fullPathname, { assert: { type: "json" } });

    await report(result.default, { title, always, token });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
