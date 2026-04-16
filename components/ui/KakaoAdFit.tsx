"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface KakaoAdFitProps {
  unit: string;
  width: number;
  height: number;
  className?: string;
}

export function KakaoAdFit({ unit, width, height, className }: KakaoAdFitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!isProduction) return;

    const container = containerRef.current;
    if (!container) return;

    const script = document.querySelector<HTMLScriptElement>(
      'script[src="//t1.daumcdn.net/kas/static/ba.min.js"], script[src="https://t1.daumcdn.net/kas/static/ba.min.js"]'
    );

    if (!script) return;

    const rerenderAd = () => {
      const ins = container.querySelector<HTMLModElement>(".kakao_ad_area");
      if (!ins) return;

      const cloned = ins.cloneNode(true);
      ins.replaceWith(cloned);
    };

    if (script.dataset.loaded === "true") {
      rerenderAd();
      return;
    }

    script.addEventListener("load", rerenderAd);

    return () => {
      script.removeEventListener("load", rerenderAd);
    };
  }, [isProduction]);

  if (!isProduction) {
    return null;
  }

  return (
    <>
      <Script
        id="kakao-adfit-script"
        src="https://t1.daumcdn.net/kas/static/ba.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          const target = document.getElementById("kakao-adfit-script");
          if (target instanceof HTMLScriptElement) {
            target.dataset.loaded = "true";
          }
        }}
      />
      <div ref={containerRef} className={className}>
        <ins
          className="kakao_ad_area"
          style={{ display: "none", width: "100%" }}
          data-ad-unit={unit}
          data-ad-width={width.toString()}
          data-ad-height={height.toString()}
        />
      </div>
    </>
  );
}
