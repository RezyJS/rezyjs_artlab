import { applyCpu } from './cpu.ts';
import * as matrices from './matrices.ts';
import type { Operation } from './types.ts';

const pointwise = new Set<Operation>(['brightness', 'negative', 'gammaFunc', 'solarization', 'moreContrast', 'lessContrast', 'kvantation']);
export const supportsGpu = (operation: Operation) => pointwise.has(operation) || operation === 'lowFreq' || operation === 'highFreq';
const vertex = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;
const fragment = `#version 300 es
precision highp float;
precision highp int;
precision highp usampler2D;
uniform usampler2D source;
uniform usampler2D lookup;
uniform int mode;
uniform float kernel[9];
layout(location=0) out uvec4 result;
void main() {
  ivec2 p = ivec2(gl_FragCoord.xy);
  uvec4 pixel = texelFetch(source, p, 0);
  if (mode == 0) {
    result = uvec4(texelFetch(lookup, ivec2(pixel.r, 0), 0).r,
                   texelFetch(lookup, ivec2(pixel.g, 0), 0).g,
                   texelFetch(lookup, ivec2(pixel.b, 0), 0).b, pixel.a);
  } else {
    vec3 sum = vec3(0.0);
    ivec2 size = textureSize(source, 0);
    int i = 0;
    for (int y = -1; y <= 1; y++) for (int x = -1; x <= 1; x++) {
      ivec2 q = clamp(p + ivec2(x, y), ivec2(0), size - 1);
      sum += vec3(texelFetch(source, q, 0).rgb) * kernel[i++];
    }
    result = uvec4(uvec3(roundEven(clamp(sum, 0.0, 255.0))), pixel.a);
  }
}`;

/** Integer textures avoid browser colour conversion and preserve alpha exactly. */
export class GpuProcessor {
  #canvas = new OffscreenCanvas(1, 1);
  #gl: WebGL2RenderingContext;
  #program: WebGLProgram;
  #input: WebGLTexture;
  #lookup: WebGLTexture;
  #output: WebGLTexture;
  #framebuffer: WebGLFramebuffer;
  constructor() {
    const gl = this.#canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false });
    if (!gl) throw new Error('WebGL2 unavailable');
    this.#gl = gl;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error(error ?? 'Shader compilation failed');
      }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader linking failed');
    this.#program = program;
    this.#input = gl.createTexture()!;
    this.#lookup = gl.createTexture()!;
    this.#output = gl.createTexture()!;
    this.#framebuffer = gl.createFramebuffer()!;
  }
  process(pixels: Uint8ClampedArray<ArrayBuffer>, width: number, height: number, operation: Operation, args: unknown[]) {
    if (!supportsGpu(operation)) return null;
    const gl = this.#gl;
    if (gl.isContextLost() || width > gl.getParameter(gl.MAX_TEXTURE_SIZE) || height > gl.getParameter(gl.MAX_TEXTURE_SIZE)) return null;
    this.#canvas.width = width;
    this.#canvas.height = height;
    const upload = (texture: WebGLTexture, unit: number, w: number, h: number, data: Uint8ClampedArray<ArrayBuffer> | null) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8UI, w, h, 0, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, data);
    };
    upload(this.#input, 0, width, height, pixels);
    upload(this.#output, 2, width, height, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.#framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.#output, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) return null;
    gl.useProgram(this.#program);
    gl.uniform1i(gl.getUniformLocation(this.#program, 'source'), 0);
    gl.uniform1i(gl.getUniformLocation(this.#program, 'lookup'), 1);
    if (pointwise.has(operation)) {
      const lut = new Uint8ClampedArray(256 * 4);
      for (let i = 0; i < 256; i++) lut.set([i, i, i, 255], i * 4);
      applyCpu(lut, 256, 1, operation, args);
      upload(this.#lookup, 1, 256, 1, lut);
      gl.uniform1i(gl.getUniformLocation(this.#program, 'mode'), 0);
    } else {
      // The sampler must remain complete even when the LUT branch is unused.
      upload(this.#lookup, 1, 1, 1, new Uint8ClampedArray(4));
      const core = args[2] as 'H1' | 'H2' | 'H3';
      const keys = operation === 'lowFreq'
        ? { H1: matrices.H1_lowFreq, H2: matrices.H2_lowFreq, H3: matrices.H3_lowFreq }
        : { H1: matrices.H1_highFreq, H2: matrices.H2_highFreq, H3: matrices.H3_highFreq };
      if (!keys[core]) throw new Error('Unknown convolution kernel');
      gl.uniform1fv(gl.getUniformLocation(this.#program, 'kernel'), keys[core]);
      gl.uniform1i(gl.getUniformLocation(this.#program, 'mode'), 1);
    }
    gl.disable(gl.BLEND);
    gl.disable(gl.DITHER);
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    const output = new Uint8ClampedArray(pixels.length);
    gl.readPixels(0, 0, width, height, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, output);
    if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) return null;
    return output;
  }
  dispose() {
    const gl = this.#gl;
    for (const texture of [this.#input, this.#lookup, this.#output]) gl.deleteTexture(texture);
    gl.deleteFramebuffer(this.#framebuffer);
    gl.deleteProgram(this.#program);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  }
}
