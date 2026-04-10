export default {
  default: {
    paths: ['specs/features/*.feature'],
    import: ['tests/features/step-definitions/**/*.js', 'tests/features/support/**/*.js'],
    format: ['progress', 'html:test-results/cucumber-report.html'],
    publishQuiet: true,
  },
};
