// Ensure JSX namespace is available for third-party type definitions.
// Bridge the global `JSX` namespace to React's JSX types so packages that
// reference `JSX.IntrinsicElements` (like some versions of react-markdown)
// can compile correctly with Next.js' TypeScript setup.

import * as React from "react";

declare global {
  namespace JSX {
    // Use React's element type
    type Element = React.ReactElement;
    // Reuse React's intrinsic element mapping
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}

export {};
