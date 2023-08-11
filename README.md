# example-component

组件功能描述

## Install

```bash
$ npm i skia-effect-shader --save
```

## Usage

```js
import getSkiaEffectImage from 'skia-effect-shader';
import CanvasKitInit, { Canvas } from "canvaskit-wasm";
import { loadImage } from "./utils";
import { useRef } from "react";
import image from "../texture.png";
export const useSkiaEffect = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  async function run(
    dataFn: () => Parameters<typeof getSkiaEffectImage>["0"]["data"]
  ) {
    const canvasKit = await CanvasKitInit();
    const webglCtx = canvasKit.GetWebGLContext(ref.current!);
    const glCtx = canvasKit.MakeWebGLContext(webglCtx)!;
    const surface = canvasKit.MakeOnScreenGLSurface(
      glCtx,
      ref.current!.width,
      ref.current!.height,
      canvasKit.ColorSpace.SRGB
    )!;
    const imgData = await loadImage(image);
    let imageSnapshot = canvasKit.MakeImageFromEncoded(imgData)!;
    const paint = new canvasKit.Paint();
    function drawFrame(canvas: Canvas) {
      const effectImg = getSkiaEffectImage({
        canvasKit,
        glCtx,
        resolution: [310, 410],
        img: imageSnapshot,
        data: dataFn(),
      })!;
      const imgShader = effectImg.makeShaderOptions(
        canvasKit.TileMode.Clamp,
        canvasKit.TileMode.Clamp,
        canvasKit.FilterMode.Nearest,
        canvasKit.MipmapMode.Nearest
      );
      paint.setShader(imgShader);
      canvas.drawPaint(paint);
      effectImg.delete();
      imgShader.delete();
      surface?.requestAnimationFrame(drawFrame);
    }
    surface?.requestAnimationFrame(drawFrame);
  }
  return {
    run,
    ref,
  };
};

```
