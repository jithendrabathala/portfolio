/**
 * Persistent HUD frame: four corner brackets pinned to the viewport.
 *
 * `fixed` rather than `absolute` is the whole point — the brackets stay welded
 * to the screen corners while the page scrolls underneath, so the frame reads
 * as the instrument you are looking through rather than as decoration
 * belonging to any one section.
 *
 * Mounted once in the root layout. The splash draws an identical set at the
 * same coordinates, so when it wipes away the frame appears continuous rather
 * than popping into place.
 *
 * z-30 sits above page content but below the rail, audio transport, project
 * overlay, cursor, and splash — the frame must never intercept a click, hence
 * pointer-events-none as well.
 *
 * Full layer order: frame 30 · rail/audio/nav transport 40 · project overlay
 * and nav sheet 50 · cursor 60 · splash 100.
 */
export function ViewportFrame() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 [&>span]:absolute [&>span]:size-8 [&>span]:border-fg/30 lg:[&>span]:size-12"
    >
      <span className="left-0 top-0 border-l-2 border-t-2" />
      <span className="right-0 top-0 border-r-2 border-t-2" />
      <span className="bottom-0 left-0 border-b-2 border-l-2" />
      <span className="bottom-0 right-0 border-b-2 border-r-2" />
    </div>
  );
}
