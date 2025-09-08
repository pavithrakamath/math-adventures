import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';
import { vi } from 'vitest';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Polyfills for Node.js environment
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    span: 'span',
    button: 'button',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  useAnimation: () => ({
    start: vi.fn(),
    stop: vi.fn(),
    set: vi.fn(),
  }),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual || {}),
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useLocation: () => ({ pathname: '/' }),
  };
});

// Setup cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
  localStorageMock.clear();
});