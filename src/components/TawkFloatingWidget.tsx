import { useEffect } from "react";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: any;
  }
}

export function TawkFloatingWidget() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if script already inserted
    if (document.getElementById("tawk-floating-script")) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Ensure embedded mode is removed so it creates the native floating launcher
    if (window.Tawk_API.embedded) {
      try {
        delete window.Tawk_API.embedded;
      } catch {
        window.Tawk_API.embedded = undefined;
      }
    }

    // Configure widget position so it sits cleanly above the mobile bottom navigation
    window.Tawk_API.customStyle = {
      visibility: {
        desktop: {
          position: "br",
          xOffset: 20,
          yOffset: 20,
        },
        mobile: {
          position: "br",
          xOffset: 16,
          yOffset: 80,
        },
      },
    };

    const s1 = document.createElement("script");
    s1.id = "tawk-floating-script";
    s1.async = true;
    s1.src = "https://embed.tawk.to/6aac00529d89af3444bee888/1k2nuis6p";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.head.appendChild(s1);
    }
  }, []);

  return null;
}
