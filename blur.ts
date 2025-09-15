import sharp from "sharp";

sharp("public/default.jpg")
  .resize(16, 16)
  .blur(10)
  .toFile("public/default-blur.png")
  .then(() => console.log("Blurred pfp generated!"));
