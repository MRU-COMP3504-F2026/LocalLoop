// jest.config.mjs
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Path to Next.js app — loads next.config and mocks CSS/assets
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // Mirror tsconfig "paths" so imports like "@/lib/utils" resolve:
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// Exported via createJestConfig because next.config can be async
export default createJestConfig(config)