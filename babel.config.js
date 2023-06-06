module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@Styles": "./src/styles",
            "@Components": "./src/components",
            "@Models": "./src/models",
            "@DigiUtils": "./src/utils",
            "@Hooks": "./src/hooks",
            "@Classes": "./src/classes",
            "@Database": "./src/database",
            "@Context": "./src/context",
            "@Screens": "./src/screens",
            "@Routes": "./src/routes",
          },
          extensions: [".ts", ".tsx"],
        },
      ],
    ],
  };
};
