// src/utils/deviceUtils.js

// utils/deviceUtils.js

export function parseUA() {
  const u = navigator.userAgent;
  const u2 = navigator.userAgent.toLowerCase();
  return {
    trident: u.indexOf("Trident") > -1, // IE engine
    presto: u.indexOf("Presto") > -1, // Opera engine
    webKit: u.indexOf("AppleWebKit") > -1, // Apple, Chrome engine
    gecko: u.indexOf("Gecko") > -1 && u.indexOf("KHTML") === -1, // Firefox engine
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // Mobile devices
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // iOS devices
    android: u.indexOf("Android") > -1 || u.indexOf("Linux") > -1, // Android devices
    iPhone: u.indexOf("iPhone") > -1, // iPhone
    iPad: u.indexOf("iPad") > -1, // iPad
    webApp: u.indexOf("Safari") === -1, // Web applications
    iosv: u.substr(u.indexOf("iPhone OS") + 9, 3), // iOS version
    weixin: u2.match(/MicroMessenger/i) === "micromessenger", // WeChat
    ali: u.indexOf("AliApp") > -1, // Alibaba App
  };
}

// Check if the user is on a mobile device
export function isMobileDevice() {
  const ua = parseUA();
  // Include the manual desktop mode override check
  const desktopModeOverride = localStorage.getItem("desktopModeOverride");
  return desktopModeOverride === "true" ? false : ua.mobile;
}

// Function to enable desktop mode manually
export const enableDesktopMode = () => {
  localStorage.setItem("desktopModeOverride", "true");
};

// Function to disable desktop mode manually (reset to mobile detection)
export const disableDesktopMode = () => {
  localStorage.removeItem("desktopModeOverride");
};

// Function to check if desktop mode is manually enabled
export const isDesktopModeEnabled = () => {
  return localStorage.getItem("desktopModeOverride") === "true";
};
