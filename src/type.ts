import type { CanvasKit, Image } from "./canvaskit";
type GenericArray<T, L extends number> = [T, ...T[]] & { length: L };
type ExpansionType = {
  type: "expansion";
  point: GenericArray<number, 2>;
  range: number;
  strength: number;
};
type TwistType = {
  type: "twist";
  point: GenericArray<number, 2>;
  range: number;
  strength: number;
};
type PerspectiveType = {
  type: "perspective";
  after: GenericArray<number, 8>;
  before: GenericArray<number, 8>;
};
type ZoomType = {
  type: "zoom";
  point: GenericArray<number, 2>;
  strength: number;
};
type TriangleType = {
  type: "triangle";
  strength: number;
};
type TiltShiftType = {
  type: "tiltShift";
  blurRadius: number;
  gradientRadius: number;
  startPoint: GenericArray<number, 2>;
  endPoint: GenericArray<number, 2>;
};
type LensType = {
  type: "lens";
  brightness: number;
  radius: number;
  angle: number;
};
type InkType = {
  type: "ink";
  strength: number;
};
type HexagonalPixelateType = {
  type: "hexagonalPixelate";
  strength: number;
  point: GenericArray<number, 2>;
};
type EdgeDetectType = {
  type: "edgeDetect";
  strength: number;
};
type DotNoiseType = {
  type: "dotNoise";
  strength: number;
  angle: number;
  point: GenericArray<number, 2>;
};
type ColorDotNoiseType = {
  type: "colorDotNoise";
  strength: number;
  angle: number;
  point: GenericArray<number, 2>;
};
type DataOptions =
  | ExpansionType
  | TwistType
  | PerspectiveType
  | ZoomType
  | TriangleType
  | TiltShiftType
  | LensType
  | InkType
  | HexagonalPixelateType
  | EdgeDetectType
  | DotNoiseType
  | ColorDotNoiseType;

export type SkiaEffectParams = {
  canvasKit: CanvasKit;
  glCtx: any;
  img: Image;
  resolution: [number, number];
  data: DataOptions;
};
