import { ReactNode, useRef } from "react";
import html2pdf from "html2pdf.js";

interface SaveToPdfProps {
  filename: string;
  /**
   * PDF Export시 용지 방향
   * - portrait : 세로
   * - landscape : 가로
   */
  orientation?: "portrait" | "landscape";
  isLoading?: boolean;
  children: ReactNode;
}

export default function SaveToPdf({
  filename,
  orientation = "portrait",
  isLoading,
  children,
}: Readonly<SaveToPdfProps>) {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExportClick = async () => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    const option = {
      // margin: 10,
      margin: [0, 0, 0, 0], // 마진을 배열로 설정하여 용지 여백없이 꽉 차게 export 할 수 있었다.
      // filename: "cluster_results.pdf",
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: orientation },
    };

    try {
      html2pdf().from(contentElement).set(option).save();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full">
      <div ref={contentRef}>{children}</div>
      {!isLoading && (
        <button onClick={() => handleExportClick()}>PDF 저장</button>
      )}
    </div>
  );
}
