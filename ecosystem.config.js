module.exports = {
  apps: [
    {
      name: "nro-app",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 4000",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
