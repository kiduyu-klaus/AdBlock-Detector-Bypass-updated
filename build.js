const { build } = require('chrome-extension-builder');

build({
  input: '.',
  output: './dist/extension.zip',
  exclude: ['node_modules', '*.pem', 'package*.json', '.git']
})
  .then(() => console.log('✓ Extension built successfully!'))
  .catch(err => console.error('Build failed:', err));

