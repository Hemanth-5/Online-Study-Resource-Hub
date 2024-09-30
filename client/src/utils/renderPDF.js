import * as pdfjsLib from "pdfjs-dist/webpack";

const renderPDF = async (pdfUrl, canvasRef, index, pageNum) => {
  const loadingTask = pdfjsLib.getDocument(pdfUrl);
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(pageNum);
  const scale = 1.5;
  const viewport = page.getViewport({ scale });
  const canvas = canvasRef.current[index];
  const context = canvas.getContext("2d");
  canvas.height = viewport.height;
  canvas.width = viewport.width;
  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };
  await page.render(renderContext);
};

export default renderPDF;
