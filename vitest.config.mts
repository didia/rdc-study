import path from 'path';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: [
      {find: '@/lib', replacement: path.resolve(__dirname, 'lib')},
      {find: '@/config', replacement: path.resolve(__dirname, 'config.js')},
      {find: '@/data', replacement: path.resolve(__dirname, 'data')},
      {find: '@', replacement: path.resolve(__dirname, 'src')},
      {find: 'server-only', replacement: path.resolve(__dirname, 'lib/admin/__tests__/server-only-stub.ts')},
    ],
  },
  test: {
    environment: 'node',
    include: ['lib/**/*.test.ts', 'src/**/*.test.{ts,tsx}'],
  },
});
