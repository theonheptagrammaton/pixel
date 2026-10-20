"use client";

import { useEffect, useState, PropsWithChildren } from "react";
import MobileEditorWarning from "./MobileEditorWarning";

export default function EditorMobileGuard({ children }: PropsWithChildren) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handle = () => setIsDesktop(mq.matches);
    handle();
    if (mq.addEventListener) mq.addEventListener("change", handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handle);
      else mq.removeListener(handle);
    };
  }, []);

  if (isDesktop === null) return null;
  return <>{isDesktop ? children : <MobileEditorWarning />}</>;
}
