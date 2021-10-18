// noinspection JSUnusedGlobalSymbols
export async function getSource(url, context, defaultGetSource) {
  if (url.endsWith('ava/entrypoints/main.mjs')) {
    return {
      source: `
export default function() {
  const runner = global.$_$tracer.avaRunner;
  var avaModuleExports = runner.test || runner.chain.test || runner.chain;
  return avaModuleExports.apply(this, arguments);
};

export function test() {
  const runner = global.$_$tracer.avaRunner;
  var avaModuleExports = runner.test || runner.chain.test || runner.chain;
  return avaModuleExports.apply(this, arguments);
};
`,
    };
  }
  return defaultGetSource(url, context, defaultGetSource);
}
