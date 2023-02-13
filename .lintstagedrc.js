const path = require('path');

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '!(**/generated/*)*': ['prettier --ignore-unknown --write'],
  '!(**/generated/*)*.{js,jsx,ts,tsx}': ['prettier --write', buildEslintCommand]
};
