import { act, renderHook } from '@testing-library/react-hooks';

import useParagonTheme from './useParagonTheme';
import { getConfig } from '../../../config';

const PARAGON_THEME_URLS = {
  core: {
    urls: {
      default: 'core.css',
    },
  },
  defaults: {
    light: 'light',
    dark: 'dark',
  },
  variants: {
    light: {
      urls: {
        default: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$21.0.0/dist/light.min.css',
      },
    },
    dark: {
      urls: {
        default: 'https://cdn.jsdelivr.net/npm/@edx/paragon@$21.0.0/dist/dark.min.css',
      },
    },
  },
};

jest.mock('../../../config', () => ({
  ...jest.requireActual('.../../../config'),
  getConfig: jest.fn().mockReturnValue({
    PUBLIC_PATH: '/',
    PARAGON_THEME_URLS,
  }),
}));

let mockMediaQueryListEvent;
const mockAddEventListener = jest.fn((dispatch, fn) => fn(mockMediaQueryListEvent));
const mockRemoveEventListener = jest.fn();

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({
    addEventListener: mockAddEventListener,
    removeEventListener: mockRemoveEventListener,
    matches: mockMediaQueryListEvent.matches,
  })),
});

Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
  },
});

describe('useParagonTheme', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    mockMediaQueryListEvent = { matches: true };
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
    window.localStorage.getItem.mockClear();
  });

  it.each([
    ['dark', 'stylesheet', 'alternate stylesheet', true], // preference is dark
    ['light', 'alternate stylesheet', 'stylesheet', false], // preference is light
  ])(
    'should configure theme variant for system preference %s and handle theme change events',
    (initialPreference, expectedDarkRel, expectedLightRel, isDarkMediaMatch) => {
      // Mock the matchMedia behavior to simulate system preference
      mockMediaQueryListEvent = { matches: isDarkMediaMatch };
      // Set up the hook and initial theme configuration
      const { result, unmount } = renderHook(() => useParagonTheme());
      const themeLinks = document.head.querySelectorAll('link');

      const checkThemeLinks = () => {
        const darkLink = document.head.querySelector('link[data-paragon-theme-variant="dark"]');
        const lightLink = document.head.querySelector('link[data-paragon-theme-variant="light"]');
        expect(darkLink.rel).toBe(expectedDarkRel);
        expect(lightLink.rel).toBe(expectedLightRel);
      };
      // Simulate initial theme configuration based on system preference
      act(() => { themeLinks.forEach((link) => link.onload()); });

      // Ensure matchMedia was called with the correct system preference
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
      expect(mockAddEventListener).toHaveBeenCalled();

      // Check initial theme setup
      checkThemeLinks();
      expect(result.current[0]).toEqual({
        isThemeLoaded: true,
        themeVariant: initialPreference,
      });
      // Unmount the hook
      unmount();
      expect(mockRemoveEventListener).toHaveBeenCalled();
    },
  );
  it('should configure theme variants according with user preference if is defined (localStorage)', () => {
    window.localStorage.getItem.mockReturnValue('light');
    const { result, unmount } = renderHook(() => useParagonTheme());
    const themeLinks = document.head.querySelectorAll('link');
    const darkLink = document.head.querySelector('link[data-paragon-theme-variant="dark"]');
    const lightLink = document.head.querySelector('link[data-paragon-theme-variant="light"]');

    act(() => { themeLinks.forEach((link) => link.onload()); });

    expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(mockAddEventListener).toHaveBeenCalled();

    expect(darkLink.rel).toBe('alternate stylesheet');
    expect(lightLink.rel).toBe('stylesheet');
    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: 'light' });

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
  it('should define the theme variant as default if only 1 is configured', () => {
    getConfig.mockReturnValueOnce({ PUBLIC_PATH: '/', PARAGON_THEME_URLS: { ...PARAGON_THEME_URLS, variants: { light: PARAGON_THEME_URLS.variants.light } } });
    window.localStorage.getItem.mockReturnValue('light');
    const { result, unmount } = renderHook(() => useParagonTheme());
    const themeLinks = document.head.querySelectorAll('link');
    const themeVariantLinks = document.head.querySelectorAll('link[data-paragon-theme-variant]');

    act(() => { themeLinks.forEach((link) => link.onload()); });

    expect(themeVariantLinks.length).toBe(1);
    expect(themeVariantLinks[0].rel).toBe('stylesheet');
    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: 'light' });

    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
  it('should not configure any theme if PARAGON_THEME_URLS is undefined', () => {
    getConfig.mockReturnValue({ PUBLIC_PATH: '/', PARAGON_THEME_URLS: undefined });
    const { result, unmount } = renderHook(() => useParagonTheme());
    const themeLinks = document.head.querySelectorAll('link');

    expect(result.current[0]).toEqual({ isThemeLoaded: true, themeVariant: undefined });
    expect(themeLinks.length).toBe(0);
    unmount();
  });
});
