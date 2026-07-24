// Use system fonts instead of local fonts to avoid font loading errors

// System font stacks
const geistSans = {
  variable: '--font-geist-sans',
  className: '',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
  }
};

const geistMono = {
  variable: '--font-geist-mono',
  className: '',
  style: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
};

const inter = {
  className: '',
  style: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
  }
};

export { geistSans, geistMono, inter };