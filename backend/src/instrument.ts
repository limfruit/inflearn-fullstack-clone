// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from "@sentry/nestjs"

Sentry.init({
  dsn: "https://dbcc5823e204256f3b67150a4b6010ac@o4510502250348544.ingest.us.sentry.io/4510521103482880",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});