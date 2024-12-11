# config-loader
Node.js Application Configuration for backend and frontend.

Hierarchical node.js configuration with JSON-based and atomic object merging.


```
npm install config-loader
```
```
yarn add config-loader
```
```
pnpm add config-loader
```

```typescript
import { loadConfig, ConfigLoaderOptions } from 'config-loader';

// Define the JSON schema for the configuration
const configSchema = {
  type: 'object',
  properties: {
    appName: { type: 'string' },
    logLevel: { type: 'string', enum: ['debug', 'info', 'warn', 'error'] },
    apiUrl: { type: 'string', format: 'uri' },
    db: {
      type: 'object',
      properties: {
        host: { type: 'string' },
        port: { type: 'integer', minimum: 1, maximum: 65535 },
        username: { type: 'string' },
        password: { type: 'string' }
      },
      required: ['host', 'port'],
    },
  },
  required: ['appName', 'logLevel', 'apiUrl', 'db'],
};

// Create options for the config loader
const options: ConfigLoaderOptions = {
  schema: configSchema,
  configDir: 'path/to/config' // Optional: custom path if needed
};

// Load the configuration
try {
  const config = loadConfig(options);  // Pass the options (including schema)
  console.log(config); // Use the loaded config
} catch (error) {
  console.error('Invalid configuration:', error.message);
}
```