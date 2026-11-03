export function getDashboardLayout(width: number, height: number, fontScale: number) {
  return {
    compact: width < 360 || height < 760,
    // Keep the details readable instead of squeezing them between icon and percentage.
    stackedPercentage: width / Math.max(fontScale, 1) < 360,
  };
}
