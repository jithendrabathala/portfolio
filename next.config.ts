import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // src/vendor/orbit-project.js is a Framer-published component that
      // imports the bare specifier "framer". That package exists on npm but
      // ships type definitions only — there is no runtime — so the import is
      // unresolvable outside Framer's canvas. src/lib/framer-shim.ts supplies
      // the four APIs it actually calls.
      //
      // Nothing else in this codebase imports "framer" (note: framer-motion is
      // a different package and is unaffected by this alias).
      framer: "./src/lib/framer-shim.ts",
    },
  },
};

export default nextConfig;
