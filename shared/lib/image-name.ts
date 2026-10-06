export function imageBaseName(name: string) {
  return name.trim().replace(/\.(avif|bmp|gif|heic|heif|ico|jpe?g|jxl|png|svg|tiff?|webp)$/i, '');
}

export function isValidImageName(name: string) {
  return name.length > 0 && name.length <= 120 && !/[<>:"/\\|?*\u0000-\u001f]/.test(name)
    && !/[. ]$/.test(name) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(name);
}
