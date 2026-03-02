const detectDevice = () => {
  const userAgent = navigator.userAgent;
  // Regular expression checks for common mobile indicators
  if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent,
    )
  ) {
    return "Mobile";
  } else {
    return "Desktop";
  }
};

export const isMobile = detectDevice() === "Mobile";
export const isDesktop = detectDevice() === "Desktop";
