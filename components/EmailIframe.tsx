import { useEffect, useRef, useState } from "react";

interface Props {
  cleanHtmlBody: string;
}

const EmailIframe = ({ cleanHtmlBody }: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState("0px");

  useEffect(() => {
    const updateIframeHeight = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const height = iframeDoc.body.scrollHeight;
      setIframeHeight(`${height}px`);
    };

    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.onload = updateIframeHeight;

    return () => {
      if (iframe) {
        iframe.onload = null;
      }
    };
  }, [cleanHtmlBody]);

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        overflow: "scroll",
      }}
    >
      <iframe
        ref={iframeRef}
        srcDoc={cleanHtmlBody}
        title="Email content"
        scrolling="no"
        style={{
          width: "100%",
          height: iframeHeight,
          border: "none",
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default EmailIframe;
