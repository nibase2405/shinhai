module.exports = {
  apps: [
    {
      name: "shinhai",
      script: "node_modules/next/dist/bin/next",
      args: "start --hostname 127.0.0.1 --port 3100",
      cwd: "/var/www/shinhai",
      exec_mode: "fork",
      instances: 1,
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
