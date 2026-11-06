module.exports = {
  apps: [
    {
      name: "germanwerks",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/var/www/germanwerks",
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
