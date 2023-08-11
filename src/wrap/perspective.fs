uniform vec2 u_resolution;
uniform vec2 u_image_resolution;
uniform float[8]u_before;
uniform float[8]u_after;
uniform shader u_image;

// 矩阵求逆，代替原生方法
mat3 m3Inverse(mat3 m) {
    float a = m[0][0], b = m[0][1], c = m[0][2];
    float d = m[1][0], e = m[1][1], f = m[1][2];
    float g = m[2][0], h = m[2][1], i = m[2][2];
    float det = a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
    mat3 inverse = mat3(
        vec3(e * i - f * h, c * h - b * i, b * f - c * e),
        vec3(f * g - d * i, a * i - c * g, c * d - a * f),
        vec3(d * h - e * g, b * g - a * h, a * e - b * d)
    );
    inverse /= det;
    return inverse;
}

// 将一个平面上的正方形映射到任意四边形上
mat3 getSquareToQuad(float x0, float y0, float x1, float y1, float x2, float y2, float x3, float y3) {
    float dx1 = x1 - x2;
    float dy1 = y1 - y2;
    float dx2 = x3 - x2;
    float dy2 = y3 - y2;
    float dx3 = x0 - x1 + x2 - x3;
    float dy3 = y0 - y1 + y2 - y3;
    float det = dx1 * dy2 - dx2 * dy1;
    float a = (dx3 * dy2 - dx2 * dy3) / det;
    float b = (dx1 * dy3 - dx3 * dy1) / det;
    mat3 mat = mat3(
        vec3(x1 - x0 + a * x1, y1 - y0 + a * y1, a),
        vec3(x3 - x0 + b * x3, y3 - y0 + b * y3, b),
        vec3(x0, y0, 1.0)
    );
    return mat;
}

// m矩阵变换进行扭曲，返回扭曲后的新坐标向量
vec2 matrixWarp(mat3 m, vec2 uv) {
    vec3 warped = m * vec3(uv, 1.0);
    return warped.xy / warped.z;
}

vec2 deform(vec2 uv, float[8]before, float[8]after) {
    mat3 a = getSquareToQuad(before[0], before[1], before[2], before[3], before[4], before[5], before[6], before[7]);
    mat3 b = getSquareToQuad(after[0], after[1], after[2], after[3], after[4], after[5], after[6], after[7]);
    mat3 c = a * m3Inverse(b);
    return matrixWarp(c, uv);
}

vec4 main(vec2 fragCoord) {
    vec2 scale = u_image_resolution.xy / u_resolution.xy;
    vec2 uv = fragCoord.xy / u_resolution.xy;
    uv = deform(uv, u_before, u_after);
    vec4 pixel = u_image.eval(uv * (u_image_resolution.xy));
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        float a = smoothstep(0.0, 1.0, 1.0);
        return vec4(pixel.rgb, 1.0 - a);
    }
    return u_image.eval(uv * (u_image_resolution.xy));
}