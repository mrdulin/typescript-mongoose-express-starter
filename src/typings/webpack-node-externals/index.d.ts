declare module 'webpack-node-externals' {
  interface Options {
    whitelist?: any[];
    importType?: string;
    modulesDir?: string;
    modulesFromFile?: boolean;
  }
  function nodeExternals(options?: Options): any;
  export = nodeExternals;
}
