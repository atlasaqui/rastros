// Safe rectangle measured in the three new 3840 × 2160 JPG compositions.
// Their built-in train surrounds the monitor; original artwork stays intact.
export const LCD_RECT = Object.freeze({
  left: 12.1,
  top: 12.8,
  width: 77.2,
  height: 75.8,
});
export const WINDOW_SIZE = Object.freeze({ width: 78, height: 80 });
export function clampWindow(win, desktopWidth, desktopHeight) {
  const maxX = 100 - WINDOW_SIZE.width;
  const maxY = Math.max(
    0,
    100 - WINDOW_SIZE.height - (32 / Math.max(1, desktopHeight)) * 100,
  );
  return {
    x: Math.max(0, Math.min(maxX, Number.isFinite(win.x) ? win.x : 14)),
    y: Math.max(0, Math.min(maxY, Number.isFinite(win.y) ? win.y : 5)),
  };
}
