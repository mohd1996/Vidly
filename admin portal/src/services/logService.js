import * as Sentry from "@sentry/browser";

function init() {
  Sentry.init({
    dsn: "https://5a9f60302187460b95082ba7c4dc152e@sentry.io/1859751"
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log
};
