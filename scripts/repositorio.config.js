module.exports = {
  apps: [
    {
      name: "upload-pdf",
      script: "npm",
      args: "run start",
      env: {
        PORT: 1411,
      },
    },
  ],
};
