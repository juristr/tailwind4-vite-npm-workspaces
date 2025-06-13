const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'
    ),
    // join(
    //   __dirname,
    //   '../..',
    //   'packages/**/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'
    // ),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
