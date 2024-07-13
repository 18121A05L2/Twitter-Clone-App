declare module "@metamask/logo" {
  interface LogoOptions {
    pxNotRatio?: boolean;
    width?: number;
    height?: number;
    followMouse?: boolean;
    slowDrift?: boolean;
  }

  interface MetamaskLogo {
    container: HTMLDivElement;
    lookAt: (coords: { x: number; y: number }) => void;
    setFollowMouse: (follow: boolean) => void;
    stopAnimation: () => void;
  }

  function makeMetamaskLogo(options: LogoOptions): MetamaskLogo;

  export default makeMetamaskLogo;
}
