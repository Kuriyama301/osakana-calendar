export const setupOGP = () => {
  const baseUrl = import.meta.env.VITE_FRONT_URL;

  const metaUrl = document.createElement("meta");
  metaUrl.setAttribute("property", "og:url");
  metaUrl.setAttribute("content", baseUrl);
  document.head.appendChild(metaUrl);

  const metaImage = document.createElement("meta");
  metaImage.setAttribute("property", "og:image");
  metaImage.setAttribute("content", `${baseUrl}/ogp.jpg`);
  document.head.appendChild(metaImage);
};
