declare module "vanta/dist/vanta.trunk.min" {
  interface VantaOptions {
    el: HTMLElement;
    p5?: any;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    backgroundColor?: number;
    spacing?: number;
    chaos?: number;
  }

  interface VantaEffect {
    destroy: () => void;
    setOptions: (opts: Partial<VantaOptions>) => void;
    resize: () => void;
  }

  const effect: (options: VantaOptions) => VantaEffect;
  export default effect;
}

interface Window {
  THREE: any;
  VANTA?: Record<string, any>;
}
