import type { SkiaEffectParams } from "./type";
export default function getSkiaEffectImage(params: SkiaEffectParams) {
  const { canvasKit, img, data, resolution, glCtx } = params;
  const surface = canvasKit.MakeOnScreenGLSurface(
    glCtx,
    ...resolution,
    canvasKit.ColorSpace.SRGB
  )!;
  const canvas = surface?.getCanvas();
  const paint = new canvasKit.Paint();
  let imageSnapshot = img.clone();
  let shader = getImageShader(canvasKit, imageSnapshot);
  const collect = [imageSnapshot, shader];
  if (data.type === "tiltShift") {
    for (let i = 0; i < 2; i++) {
      shader = getFragShader(canvasKit, {
        frag: require("./blur/tiltShift.fs"),
        uniforms: [
          ...resolution,
          ...[imageSnapshot.width(), imageSnapshot.height()],
          data.blurRadius,
          data.gradientRadius,
          ...data.startPoint,
          ...data.endPoint,
          i,
        ],
        children: [shader],
      });
      paint.setShader(shader);
      canvas?.drawPaint(paint);
      imageSnapshot = surface.makeImageSnapshot();
      shader = getImageShader(canvasKit, imageSnapshot);
      collect.push(shader);
      collect.push(imageSnapshot);
    }
  }
  if (data.type === "lens") {
    for (let i = 0; i < 5; i++) {
      shader = getFragShader(canvasKit, {
        frag: require("./blur/lens.fs"),
        uniforms: [
          ...resolution,
          ...[imageSnapshot.width(), imageSnapshot.height()],
          data.brightness,
          data.radius,
          data.angle,
          i,
        ],
        children: [shader],
      });
      paint.setShader(shader);
      canvas?.drawPaint(paint);
      imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
      shader = getImageShader(canvasKit, imageSnapshot);
      collect.push(shader);
      collect.push(imageSnapshot);
    }
  }
  if (data.type === "colorDotNoise") {
    shader = getFragShader(canvasKit, {
      frag: require("./special/colorDotNoise.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        data.strength,
        data.angle,
        ...data.point,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "dotNoise") {
    shader = getFragShader(canvasKit, {
      frag: require("./special/dotNoise.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        data.strength,
        data.angle,
        ...data.point,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "edgeDetect") {
    shader = getFragShader(canvasKit, {
      frag: require("./special/edgeDetect.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        data.strength,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "expansion") {
    shader = getFragShader(canvasKit, {
      frag: require("./wrap/expansion.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        ...data.point,
        data.range,
        data.strength,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "hexagonalPixelate") {
    shader = getFragShader(canvasKit, {
      frag: require("./special/hexagonalPixelate.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        data.strength,
        ...data.point,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "ink") {
    shader = getFragShader(canvasKit, {
      frag: require("./special/ink.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        data.strength,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "perspective") {
    shader = getFragShader(canvasKit, {
      frag: require("./wrap/perspective.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        ...data.before,
        ...data.after,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "triangle") {
    for (let i = 0; i < 2; i++) {
      shader = getFragShader(canvasKit, {
        frag: require("./blur/triangle.fs"),
        uniforms: [
          ...resolution,
          ...[imageSnapshot.width(), imageSnapshot.height()],
          data.strength,
          i,
        ],
        children: [shader],
      });
      paint.setShader(shader);
      canvas?.drawPaint(paint);
      imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
      shader = getImageShader(canvasKit, imageSnapshot);
      collect.push(shader);
      collect.push(imageSnapshot);
    }
  }
  if (data.type === "twist") {
    shader = getFragShader(canvasKit, {
      frag: require("./wrap/twist.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        ...data.point,
        data.range,
        data.strength,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  if (data.type === "zoom") {
    shader = getFragShader(canvasKit, {
      frag: require("./blur/zoom.fs"),
      uniforms: [
        ...resolution,
        ...[imageSnapshot.width(), imageSnapshot.height()],
        ...data.point,
        data.strength,
      ],
      children: [shader],
    });
    paint.setShader(shader);
    canvas?.drawPaint(paint);
    imageSnapshot = surface.makeImageSnapshot([0, 0, ...resolution]);
    shader = getImageShader(canvasKit, imageSnapshot);
    collect.push(shader);
    collect.push(imageSnapshot);
  }
  for (const item of collect) {
    if (item !== imageSnapshot) {
      item.delete();
    }
  }
  surface.delete();
  paint.delete();
  return imageSnapshot;
}

function getImageShader(
  canvasKit: SkiaEffectParams["canvasKit"],
  img: SkiaEffectParams["img"]
) {
  return img.makeShaderOptions(
    canvasKit.TileMode.Clamp,
    canvasKit.TileMode.Clamp,
    canvasKit.FilterMode.Linear,
    canvasKit.MipmapMode.Linear
  );
}

function getFragShader(
  canvasKit: SkiaEffectParams["canvasKit"],
  options: {
    frag: string;
    uniforms: any[];
    children: any[];
  }
) {
  const effect = canvasKit.RuntimeEffect.Make(options.frag)!;
  const shader = effect.makeShaderWithChildren(
    options.uniforms,
    options.children
  );
  return shader;
}
