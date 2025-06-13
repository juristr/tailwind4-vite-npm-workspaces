const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'),
    join(__dirname, '../../packages/products/feat-product-detail/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'),
    join(__dirname, '../../packages/products/feat-product-list/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'),
    join(__dirname, '../../packages/products/data-access-products/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'),
    join(__dirname, '../../packages/products/ui-product-detail/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'),
    join(__dirname, '../../packages/shared/utils/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}'),
    join(__dirname, '../../packages/shared/ui/{src,lib,components}/**/*!(*.stories|*.spec).{ts,tsx,html,jsx}')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
