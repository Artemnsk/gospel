"use strict";

module.exports = {
    // Whether or not to use SSL. SSL is always used for live Slack apps however that could be skipped for local development inside app's workspace.
    useSSL: false,
    // Protocol your service run on. That must be HTTPS for live Slack app however they allow you to use HTTP for
    // development inside app workspace only.
    protocol: "http",
    // Host service run on. That could be localhost during development or some real domain.
    host: "localhost",
    // Slack app client_id. Retrieved on App dashboard in settings tab.
    client_id: '<>',
    // This token is simply used to know that request being done from Slack. Like an additional not fully reliable protection against attacks.
    verification_token: '<>'
};