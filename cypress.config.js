import { defineConfig } from "cypress";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
      viteConfig: {
        plugins: [
          vue({
            template: {
              compilerOptions: {
                isCustomElement: (tag) => tag.includes("-"),
              },
            },
          }),
        ],
      },
    },
  },
  reporter: "cypress-multi-reporters",
  reporterOptions: {
    reporterEnabled: "mochawesome",
    mochawesomeReporterOptions: {
      reportDir: "cypress/reports/mocha",
      reportFilename: "index",
      quiet: true,
      overwrite: false,
      html: false,
      json: true,
    },
  },
});
