import core from "@actions/core";
import fs from "fs";
import path from "path";
import cp from "child_process";
import { report } from "./utils.js";

async function run() {
  try {
    const pathname = core.getInput("pathname", { required: true });

    const fullPathname = path.resolve(process.env.GITHUB_WORKSPACE, pathname);

    try {
      fs.accessSync(fullPathname, fs.constants.R_OK);
    } catch (err) {
      core.warning(`${fullPathname}: access error! ${err}`);
      return;
    }

    const result = await import(fullPathname, { assert: { type: "json" } });

    await report(result);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
