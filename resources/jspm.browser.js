SystemJS.config({
  baseURL: ".",
  trace: false,
  production: true,
  paths: {
    "github:": "jspm_packages/github/",
    "npm:": "jspm_packages/npm/",
    "app/": "src/"
  }
});
