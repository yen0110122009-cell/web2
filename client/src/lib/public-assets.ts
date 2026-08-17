/**
 * Resolves garden media for both the Manus preview and the compiled GitHub Pages site.
 * The interactive preview keeps its managed storage URLs, while Pages serves a checked-in copy.
 */
export function gardenAsset(filename: string) {
  const base = import.meta.env.BASE_URL;
  return base === "/" ? `/manus-storage/${filename}` : `${base}garden-assets/${filename}`;
}
