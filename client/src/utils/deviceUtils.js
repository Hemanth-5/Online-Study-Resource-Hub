export const isMobileDevice = () => {
  // Retrieve the user agent string from the browser
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Regular expression to detect common mobile devices
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    userAgent
  );
};
