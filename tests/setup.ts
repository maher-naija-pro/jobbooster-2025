// Test setup file for Jest
import { jest } from '@jest/globals';

// Set test timeout
jest.setTimeout(30000);

// Mock console methods to reduce noise in tests
const originalConsole = console;
global.console = {
    ...originalConsole,
    // Keep error and warn for debugging
    error: originalConsole.error,
    warn: originalConsole.warn,
    // Mock info and log to reduce noise
    info: jest.fn(),
    log: jest.fn(),
};
