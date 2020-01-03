module.exports = {
  preset: "ts-jest",
  timers: "fake",
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts"],
  coveragePathIgnorePatterns: ["/node_modules/"],
  coverageDirectory: "coverage",
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
