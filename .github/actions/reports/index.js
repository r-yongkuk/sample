import core from "@actions/core";
import fs from "fs";
import path from "path";
import { report } from "./utils";

async function run() {
  try {
    const pathname = core.getInput("pathname", { required: true });

    const fullPathname = path.resolve(process.env.GITHUB_WORKSPACE, pathname);

    try {
      fs.accessSync(fullPathname, fs.constants.R_OK);
    } catch (err) {
      core.warning(`${fullPathname}: access error!`);
      return;
    }

    const result = await import(fullPathname);

    await report(result);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
