export type Pose = { scale: number; x: number; y: number };
export type Size = { width: number; height: number };
export type Point = { x: number; y: number };

export function fitScale(image: Size, canvas: Size) {
  return Math.min(1, canvas.width / image.width, canvas.height / image.height) || 1;
}

export function constrain(pose: Pose, image: Size, canvas: Size): Pose {
  const x = Math.max(0, (image.width * pose.scale - canvas.width) / 2);
  const y = Math.max(0, (image.height * pose.scale - canvas.height) / 2);
  return { scale: pose.scale, x: Math.max(-x, Math.min(x, pose.x)), y: Math.max(-y, Math.min(y, pose.y)) };
}

export function zoomAt(pose: Pose, scale: number, point: Point): Pose {
  const factor = scale / pose.scale;
  return { scale, x: point.x - (point.x - pose.x) * factor, y: point.y - (point.y - pose.y) * factor };
}

export function imagePoint(point: Point, pose: Pose, image: Size): Point | null {
  const x = Math.floor((point.x - pose.x) / pose.scale + image.width / 2);
  const y = Math.floor((point.y - pose.y) / pose.scale + image.height / 2);
  return x >= 0 && y >= 0 && x < image.width && y < image.height ? { x, y } : null;
}
