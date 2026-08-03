import {
  DropdownControl
} from "./chunk-NCBI5OCB.js";

// src/components/ImageToolsStudio.tsx
import { useEffect, useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var imageToolModules = [
  { id: "compress", name: "Image Compressor", group: "Optimize" },
  { id: "to-webp", name: "Image to WebP", group: "Optimize" },
  { id: "webp-png", name: "WebP to PNG", group: "Optimize" },
  { id: "resize", name: "Image Resizer", group: "Resize & Crop" },
  { id: "passport", name: "Passport Photo Maker", group: "Resize & Crop" },
  { id: "profile", name: "Profile Picture Cropper", group: "Resize & Crop" },
  { id: "social-size", name: "Social Media Size Converter", group: "Resize & Crop" },
  { id: "background", name: "Background Remover", group: "Product & Privacy" },
  { id: "product-clean", name: "Product Image Background Cleaner", group: "Product & Privacy" },
  { id: "shadow", name: "Product Photo Shadow Generator", group: "Product & Privacy" },
  { id: "blur-face", name: "Blur Face Tool", group: "Product & Privacy" },
  { id: "screenshot", name: "Screenshot Beautifier", group: "Design" }
];
var tools = imageToolModules;
var c = "w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-900 focus:ring-2 focus:ring-gray-100";
var btn = "rounded-xl bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40";
var MAX_IMAGE_BYTES = 40 * 1024 * 1024;
var MAX_SOURCE_PIXELS = 5e7;
var MAX_EXPORT_PIXELS = 36e6;
var MAX_EXPORT_EDGE = 6e3;
var formatBytes = (bytes) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1024 / 1024).toFixed(2)} MB`;
function validateImageFile(file, width, height) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return "Choose a JPG, PNG or WebP image.";
  if (file.size > MAX_IMAGE_BYTES) return `${file.name} is larger than the ${formatBytes(MAX_IMAGE_BYTES)} limit.`;
  if (width && height && width * height > MAX_SOURCE_PIXELS) return `This image contains ${(width * height / 1e6).toFixed(1)} megapixels. Keep source images at or below ${MAX_SOURCE_PIXELS / 1e6} megapixels.`;
  return null;
}
function imageFrom(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The browser could not decode this image."));
    image.src = url;
  });
}
function canvasBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("The browser could not create the export.")), type, quality));
}
function ImageToolsStudio({ initialTool = "compress", embedded = false } = {}) {
  const [active, setActive] = useState(initialTool);
  const [src, setSrc] = useState("");
  const [fileName, setFileName] = useState("image");
  const [quality, setQuality] = useState("82");
  const [width, setWidth] = useState("1200");
  const [height, setHeight] = useState("1200");
  const [preset, setPreset] = useState("Instagram square \u2014 1080\xD71080");
  const [threshold, setThreshold] = useState("38");
  const [region, setRegion] = useState("30,15,40,40");
  const [padding, setPadding] = useState("100");
  const [color, setColor] = useState("#7c3aed");
  const [status, setStatus] = useState("Choose an image to begin.");
  const [original, setOriginal] = useState(null);
  const [output, setOutput] = useState(null);
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    setActive(initialTool);
    setOutput(null);
  }, [initialTool]);
  const canvas = useRef(null);
  const groups = Array.from(new Set(tools.map((x) => x.group)));
  const mime = active === "to-webp" || active === "compress" ? "image/webp" : "image/png";
  const choose = (id) => {
    setActive(id);
    setOutput(null);
    setStatus(src ? "Configure the option and create a fresh preview." : "Choose an image to begin.");
  };
  const load = async (file) => {
    if (!file) return;
    setBusy(true);
    setOutput(null);
    const initialError = validateImageFile(file);
    if (initialError) {
      setSrc("");
      setOriginal(null);
      setStatus(initialError);
      setBusy(false);
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const image = await imageFrom(url);
      const dimensionError = validateImageFile(file, image.naturalWidth, image.naturalHeight);
      if (dimensionError) {
        setSrc("");
        setOriginal(null);
        setStatus(dimensionError);
        return;
      }
      const reader = new FileReader();
      const data = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("The browser could not read this image."));
        reader.readAsDataURL(file);
      });
      setSrc(data);
      setFileName(file.name.replace(/\.[^.]+$/, ""));
      setOriginal({ name: file.name, size: file.size, type: file.type, width: image.naturalWidth, height: image.naturalHeight });
      setStatus(`${file.name} loaded locally at ${image.naturalWidth} \xD7 ${image.naturalHeight}px.`);
    } catch (error) {
      setSrc("");
      setOriginal(null);
      setStatus(error instanceof Error ? error.message : "Could not load this image.");
    } finally {
      URL.revokeObjectURL(url);
      setBusy(false);
    }
  };
  const render = async () => {
    const el = canvas.current;
    if (!el || !src) return null;
    setBusy(true);
    setStatus("Rendering a high-quality preview locally\u2026");
    try {
      const image = await imageFrom(src);
      draw(active, image, el, { quality: +quality / 100, width: +width, height: +height, preset, threshold: +threshold, region, padding: +padding, color });
      const blob = await canvasBlob(el, mime, +quality / 100);
      setOutput({ size: blob.size, type: mime, width: el.width, height: el.height });
      setStatus(`Preview ready at ${el.width} \xD7 ${el.height}px \xB7 ${formatBytes(blob.size)} estimated export.`);
      return blob;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not render this image.");
      return null;
    } finally {
      setBusy(false);
    }
  };
  const download = async () => {
    const blob = await render();
    if (!blob) return;
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url;
    link.download = `${fileName}-${active}.${mime === "image/webp" ? "webp" : "png"}`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 5e3);
    setStatus(`Downloaded ${formatBytes(blob.size)} ${mime === "image/webp" ? "WebP" : "PNG"} at ${canvas.current?.width} \xD7 ${canvas.current?.height}px.`);
  };
  const saving = original && output ? original.size - output.size : null;
  return /* @__PURE__ */ jsxs("div", { "data-testid": "image-tools-studio", "data-hydrated": hydrated ? "true" : "false", className: embedded ? "min-w-0" : "grid gap-5 xl:grid-cols-[270px_minmax(0,1fr)]", children: [
    !embedded && /* @__PURE__ */ jsxs("aside", { className: "self-start rounded-2xl border bg-white p-3 shadow-sm xl:sticky xl:top-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "px-3 pb-3 pt-2", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.18em] text-purple-600", children: "12 image utilities" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-lg font-bold", children: "Image Tools" })
      ] }),
      groups.map((g) => /* @__PURE__ */ jsxs("div", { className: "mb-3", children: [
        /* @__PURE__ */ jsx("p", { className: "px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-gray-400", children: g }),
        tools.filter((x) => x.group === g).map((x) => /* @__PURE__ */ jsx("button", { onClick: () => choose(x.id), className: `mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${active === x.id ? "bg-gray-950 font-semibold text-white" : "text-gray-700 hover:bg-gray-100"}`, children: x.name }, x.id))
      ] }, g))
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "min-w-0 space-y-5", children: [
      /* @__PURE__ */ jsxs("header", { className: "rounded-2xl border bg-gradient-to-r from-purple-50 to-pink-50 p-5", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-bold uppercase tracking-[.16em] text-purple-700", children: "Image Tools" }),
        /* @__PURE__ */ jsx("h2", { className: "mt-1 text-2xl font-bold", children: tools.find((x) => x.id === active)?.name }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-gray-600", children: "Your image stays in this browser and is never uploaded." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]", children: [
        /* @__PURE__ */ jsxs("section", { className: "space-y-4 rounded-2xl border bg-white p-5", children: [
          /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Choose image" }),
            /* @__PURE__ */ jsx("input", { className: c, type: "file", accept: "image/jpeg,image/png,image/webp", onChange: (e) => load(e.target.files?.[0]) })
          ] }),
          ["compress", "to-webp"].includes(active) && /* @__PURE__ */ jsx(Field, { label: "Quality (%)", value: quality, set: setQuality, type: "range" }),
          active === "resize" && /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsx(Field, { label: "Width px", value: width, set: setWidth }),
            /* @__PURE__ */ jsx(Field, { label: "Height px", value: height, set: setHeight })
          ] }),
          ["passport", "social-size"].includes(active) && /* @__PURE__ */ jsxs("label", { className: "block", children: [
            /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: "Output preset" }),
            /* @__PURE__ */ jsx(DropdownControl, { className: c, ariaLabel: "Output preset", value: preset, onChange: setPreset, options: active === "passport" ? ["35\xD745 mm \u2014 413\xD7531", "2\xD72 inch \u2014 600\xD7600", "50\xD770 mm \u2014 591\xD7827"] : ["Instagram square \u2014 1080\xD71080", "Instagram portrait \u2014 1080\xD71350", "Story / Reel \u2014 1080\xD71920", "Facebook landscape \u2014 1200\xD7630", "YouTube thumbnail \u2014 1280\xD7720", "LinkedIn post \u2014 1200\xD7627"] })
          ] }),
          ["background", "product-clean"].includes(active) && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Field, { label: "Background tolerance", value: threshold, set: setThreshold, type: "range" }),
            /* @__PURE__ */ jsx(Color, { label: "Background sample color", value: color, set: setColor })
          ] }),
          active === "blur-face" && /* @__PURE__ */ jsx(Field, { label: "Blur region: x%, y%, width%, height%", value: region, set: setRegion }),
          active === "screenshot" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Field, { label: "Canvas padding px", value: padding, set: setPadding }),
            /* @__PURE__ */ jsx(Color, { label: "Gradient color", value: color, set: setColor })
          ] }),
          active === "shadow" && /* @__PURE__ */ jsx(Color, { label: "Background color", value: color, set: setColor }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
            /* @__PURE__ */ jsx("button", { className: btn, disabled: !src || busy, onClick: render, children: busy ? "Processing\u2026" : "Create preview" }),
            /* @__PURE__ */ jsx("button", { className: "rounded-xl border px-4 py-2.5 text-sm font-semibold disabled:opacity-40", disabled: !src || busy, onClick: download, children: "Download" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs leading-5 text-gray-500", children: active === "background" ? "Color-based removal works best on plain, evenly lit backgrounds. Complex scenes require manual or AI refinement." : active === "blur-face" ? "Enter the face rectangle as percentages of the image. Review the exported image closely before sharing." : active === "passport" ? "Dimensions alone do not guarantee official compliance. Verify head position, background and current authority requirements." : "Preview and export are produced with browser canvas at up to 36 megapixels." }),
          (original || output) && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs", children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-gray-900", children: "Quality diagnostics" }),
            original && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-gray-600", children: [
              "Original: ",
              original.width,
              " \xD7 ",
              original.height,
              "px \xB7 ",
              formatBytes(original.size),
              " \xB7 ",
              original.type.replace("image/", "").toUpperCase()
            ] }),
            output && /* @__PURE__ */ jsxs("p", { className: "mt-1 text-gray-600", children: [
              "Export: ",
              output.width,
              " \xD7 ",
              output.height,
              "px \xB7 ",
              formatBytes(output.size),
              " \xB7 ",
              output.type.replace("image/", "").toUpperCase()
            ] }),
            saving !== null && /* @__PURE__ */ jsx("p", { className: `mt-1 font-medium ${saving >= 0 ? "text-emerald-700" : "text-amber-700"}`, children: saving >= 0 ? `${formatBytes(saving)} smaller (${(saving / original.size * 100).toFixed(1)}%)` : `${formatBytes(Math.abs(saving))} larger because of format or dimensions` })
          ] }),
          /* @__PURE__ */ jsx("p", { role: "status", className: "rounded-xl bg-gray-100 p-3 text-xs text-gray-700", children: status })
        ] }),
        /* @__PURE__ */ jsx("section", { className: "overflow-auto rounded-2xl border bg-[linear-gradient(45deg,#eee_25%,transparent_25%),linear-gradient(-45deg,#eee_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#eee_75%),linear-gradient(-45deg,transparent_75%,#eee_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px] p-5", children: /* @__PURE__ */ jsx("canvas", { ref: canvas, className: "mx-auto max-h-[760px] max-w-full bg-white shadow-lg" }) })
      ] })
    ] })
  ] });
}
function Field({ label, value, set, type = "text" }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: label }),
    /* @__PURE__ */ jsx("input", { className: c, type, min: type === "range" ? 1 : void 0, max: type === "range" ? 100 : void 0, value, onChange: (e) => set(e.target.value) }),
    type === "range" && /* @__PURE__ */ jsxs("span", { className: "mt-1 block text-xs text-gray-500", children: [
      value,
      "%"
    ] })
  ] });
}
function Color({ label, value, set }) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "mb-1 block text-sm font-medium", children: label }),
    /* @__PURE__ */ jsx("input", { type: "color", value, onChange: (e) => set(e.target.value), className: "h-12 w-full rounded-xl border p-1" })
  ] });
}
var sizes = { "35\xD745 mm \u2014 413\xD7531": [413, 531], "2\xD72 inch \u2014 600\xD7600": [600, 600], "50\xD770 mm \u2014 591\xD7827": [591, 827], "Instagram square \u2014 1080\xD71080": [1080, 1080], "Instagram portrait \u2014 1080\xD71350": [1080, 1350], "Story / Reel \u2014 1080\xD71920": [1080, 1920], "Facebook landscape \u2014 1200\xD7630": [1200, 630], "YouTube thumbnail \u2014 1280\xD7720": [1280, 720], "LinkedIn post \u2014 1200\xD7627": [1200, 627] };
function cover(ctx, img, w, h) {
  const s = Math.max(w / img.width, h / img.height), dw = img.width * s, dh = img.height * s;
  ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
}
function hex(v) {
  return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)];
}
function removeColor(ctx, w, h, color, tolerance, clean = false) {
  const data = ctx.getImageData(0, 0, w, h), [r, g, b] = hex(color);
  for (let i = 0; i < data.data.length; i += 4) {
    const d = Math.sqrt((data.data[i] - r) ** 2 + (data.data[i + 1] - g) ** 2 + (data.data[i + 2] - b) ** 2);
    if (d < tolerance * (clean ? 2.2 : 1.5)) {
      const alpha = Math.min(255, Math.max(0, (d - tolerance * 0.35) / (tolerance * 1.15) * 255));
      data.data[i + 3] = alpha;
    }
  }
  ctx.putImageData(data, 0, 0);
}
function draw(tool, img, el, o) {
  let w = img.width, h = img.height;
  if (tool === "resize") {
    w = Math.max(1, o.width);
    h = Math.max(1, o.height);
  }
  if (["passport", "social-size"].includes(tool)) [w, h] = sizes[o.preset];
  if (tool === "profile") w = h = Math.min(img.width, img.height, 2400);
  if (tool === "screenshot") {
    w = img.width + o.padding * 2;
    h = img.height + o.padding * 2;
  }
  if (tool === "shadow") {
    w = img.width + 160;
    h = img.height + 160;
  }
  const scale = Math.min(1, MAX_EXPORT_EDGE / Math.max(w, h), Math.sqrt(MAX_EXPORT_PIXELS / (w * h)));
  w = Math.max(1, Math.round(w * scale));
  h = Math.max(1, Math.round(h * scale));
  el.width = w;
  el.height = h;
  const ctx = el.getContext("2d", { alpha: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.clearRect(0, 0, w, h);
  if (tool === "screenshot") {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, o.color);
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.shadowColor = "rgba(0,0,0,.35)";
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(img, o.padding * scale, o.padding * scale, img.width * scale, img.height * scale);
    return;
  }
  if (tool === "shadow") {
    ctx.fillStyle = o.color;
    ctx.fillRect(0, 0, w, h);
    ctx.shadowColor = "rgba(0,0,0,.3)";
    ctx.shadowBlur = 35;
    ctx.shadowOffsetY = 25;
    ctx.drawImage(img, 80 * scale, 50 * scale, img.width * scale, img.height * scale);
    return;
  }
  if (tool === "profile") {
    ctx.save();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
    ctx.clip();
    cover(ctx, img, w, h);
    ctx.restore();
    return;
  }
  if (["passport", "social-size"].includes(tool)) cover(ctx, img, w, h);
  else ctx.drawImage(img, 0, 0, w, h);
  if (["background", "product-clean"].includes(tool)) removeColor(ctx, w, h, o.color, o.threshold, tool === "product-clean");
  if (tool === "blur-face") {
    const [x, y, rw, rh] = o.region.split(",").map(Number);
    const sx = w * x / 100, sy = h * y / 100, sw = w * rw / 100, sh = h * rh / 100;
    ctx.save();
    ctx.filter = "blur(22px)";
    ctx.drawImage(el, sx, sy, sw, sh, sx - 15, sy - 15, sw + 30, sh + 30);
    ctx.restore();
  }
}

export {
  imageToolModules,
  validateImageFile,
  ImageToolsStudio
};
