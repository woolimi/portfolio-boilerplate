const config = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSpacing: true,
  arrowParens: 'always',
  printWidth: 100,
  endOfLine: 'lf',
  jsxSingleQuote: false,
  plugins: ['@trivago/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['cva', 'cn'],
};

export default config;
