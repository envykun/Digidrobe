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
          },
          extensions: [".ts", ".tsx"],
        },
      ],
    ],
  };
};
