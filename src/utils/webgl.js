// Chrome with "Use graphics acceleration when available" turned off provides no
// WebGL context at all. three.js throws while constructing the renderer, and
// that throw happens inside react-three-fiber's own setup rather than in the
// React tree, so an error boundary never sees it and the whole app dies.
//
// Probing first means the canvases are simply never mounted, and the rest of
// the site renders normally.

let supported = null;

export function isWebGLAvailable() {
  if (supported !== null) return supported;

  if (typeof document === "undefined") {
    supported = false;
    return supported;
  }

  try {
    const probe = document.createElement("canvas");
    const context =
      probe.getContext("webgl2") ||
      probe.getContext("webgl") ||
      probe.getContext("experimental-webgl");

    supported = Boolean(context);

    // Contexts are a limited resource, so hand the probe back immediately.
    context?.getExtension?.("WEBGL_lose_context")?.loseContext?.();
  } catch {
    supported = false;
  }

  return supported;
}
