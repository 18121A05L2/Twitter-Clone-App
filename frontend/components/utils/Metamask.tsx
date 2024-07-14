import { useRef, useEffect, useMemo } from "react";
import { bool, number, oneOfType, string } from "prop-types";
import makeMetamaskLogo from "@metamask/logo";

const MetamaskLogo = ({
  pxNotRatio = true,
  width = 500,
  height = 400,
  followMouse = false,
  slowDrift = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const viewer = useMemo(
    () =>
      makeMetamaskLogo({ pxNotRatio, width, height, followMouse, slowDrift }),
    [pxNotRatio, width, height, followMouse, slowDrift]
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    container.innerHTML = ""; // Clear any existing content in the container
    container.appendChild(viewer.container);

    viewer.lookAt({ x: 100, y: 100 });

    return () => {
      viewer.stopAnimation();
      if (viewer.container.parentNode === container) {
        container.removeChild(viewer.container);
      }
    };
  }, [containerRef, viewer, followMouse, slowDrift]);

  return <div ref={containerRef} style={{ width, height }} />;
};

MetamaskLogo.propTypes = {
  pxNotRatio: bool,
  width: oneOfType([number, string]),
  height: oneOfType([number, string]),
  followMouse: bool,
  slowDrift: bool,
};

MetamaskLogo.defaultProps = {
  pxNotRatio: true,
  width: 500,
  height: 400,
  followMouse: false,
  slowDrift: false,
};

export default MetamaskLogo;
