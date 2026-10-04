const BRAND_COLOR = "#166534";
const LIGHT_GREEN = "#dcfce7";
const TEXT_COLOR = "#111827";
const MUTED_COLOR = "#6b7280";

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawHeader(ctx, width, subtitle) {
  ctx.fillStyle = BRAND_COLOR;
  ctx.fillRect(0, 0, width, 90);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px Inter, Arial";
  ctx.fillText("PashuPehchan", 28, 38);
  ctx.font = "13px Inter, Arial";
  ctx.fillStyle = "#86efac";
  ctx.fillText(subtitle, 28, 62);
  const now = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  ctx.fillStyle = "#86efac";
  ctx.font = "11px Inter, Arial";
  ctx.textAlign = "right";
  ctx.fillText(now, width - 24, 62);
  ctx.textAlign = "left";
}

function drawFooter(ctx, width, height) {
  ctx.fillStyle = BRAND_COLOR;
  ctx.fillRect(0, height - 34, width, 34);
  ctx.fillStyle = "#86efac";
  ctx.font = "10px Inter, Arial";
  ctx.textAlign = "center";
  ctx.fillText("PashuPehchan · AI-Based Cattle & Buffalo Breed Identification · IPD Project 2025–26", width / 2, height - 12);
  ctx.textAlign = "left";
}

function drawLabelValue(ctx, label, value, x, y, valueColor) {
  ctx.fillStyle = MUTED_COLOR;
  ctx.font = "12px Inter, Arial";
  ctx.fillText(label, x, y);
  ctx.fillStyle = valueColor || TEXT_COLOR;
  ctx.font = "bold 14px Inter, Arial";
  ctx.fillText(value, x, y + 20);
}

export function downloadBreedSummary(breed, confidence) {
  const W = 720, H = 440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f0fdf4";
  ctx.fillRect(0, 0, W, H);

  drawHeader(ctx, W, "Breed Detection Summary");

  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(28, 108, W - 56, 1);

  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "bold 18px Inter, Arial";
  ctx.fillText("BREED DETECTION RESULT", 28, 138);

  const typeLabel = breed.type === "Cattle" ? "🐄 Cattle" : "🐃 Buffalo";
  ctx.font = "bold 28px Inter, Arial";
  ctx.fillStyle = BRAND_COLOR;
  ctx.fillText(`${breed.name} ${typeLabel}`, 28, 180);

  ctx.fillStyle = "#16a34a";
  ctx.font = "bold 14px Inter, Arial";
  ctx.fillText(`Confidence: ${confidence}%`, 28, 206);

  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(28, 220, W - 56, 1);

  drawLabelValue(ctx, "Animal Type", breed.type, 28, 240);
  drawLabelValue(ctx, "Breed", breed.name, 200, 240);
  drawLabelValue(ctx, "Origin", breed.origin, 400, 240);

  drawLabelValue(ctx, "Coat Color", breed.color, 28, 300);
  drawLabelValue(ctx, "Lactation Period", `~${breed.lactationDays} days`, 300, 300);

  ctx.fillStyle = MUTED_COLOR;
  ctx.font = "12px Inter, Arial";
  ctx.fillText("Description", 28, 360);
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "13px Inter, Arial";
  const words = breed.description.split(" ");
  let line = "", lineY = 380;
  for (const word of words) {
    const test = line + word + " ";
    if (ctx.measureText(test).width > W - 56) { ctx.fillText(line, 28, lineY); line = word + " "; lineY += 18; }
    else line = test;
  }
  ctx.fillText(line, 28, lineY);

  drawFooter(ctx, W, H);

  const link = document.createElement("a");
  link.download = `breed-${breed.name.toLowerCase()}-summary.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export function downloadMilkSummary(breed, milkData, source) {
  const W = 720, H = 400;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#f0fdf4";
  ctx.fillRect(0, 0, W, H);

  drawHeader(ctx, W, "Predicted Milk Yield Summary");

  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "bold 18px Inter, Arial";
  ctx.fillText("PREDICTED MILK YIELD", 28, 138);

  ctx.font = "bold 24px Inter, Arial";
  ctx.fillStyle = BRAND_COLOR;
  ctx.fillText(`${breed.name} ${breed.type}`, 28, 174);
  ctx.font = "12px Inter, Arial";
  ctx.fillStyle = MUTED_COLOR;
  ctx.fillText(`Source: ${source}`, 28, 196);

  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(28, 210, W - 56, 1);

  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "bold 14px Inter, Arial";
  ctx.fillText("MODEL OUTPUT", 28, 234);

  drawLabelValue(ctx, "Predicted Milk Yield", `${milkData.toFixed(2)} L/day`, 28, 252, BRAND_COLOR);

  ctx.fillStyle = "#bbf7d0";
  ctx.fillRect(28, 310, W - 56, 1);

  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "bold 14px Inter, Arial";
  ctx.fillText("REMARKS", 28, 334);
  ctx.fillStyle = MUTED_COLOR;
  ctx.font = "12px Inter, Arial";
  ctx.fillText("This file contains only the milk-yield prediction from the trained model.", 28, 356);

  drawFooter(ctx, W, H);

  const link = document.createElement("a");
  link.download = `milk-${breed.name.toLowerCase()}-summary.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
