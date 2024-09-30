import React, { useState } from "react";
import * as XLSX from "xlsx";
import SaveToPdf from "./SaveToPdf";

export default function ExcelReaderPage() {
  const [data, setData] = useState<
    { storeName: string; description: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const binaryStr = e.target?.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0]; // 첫 번째 시트 선택
        const worksheet = workbook.Sheets[sheetName];

        // 데이터를 JSON 형식으로 변환
        const jsonData = XLSX.utils.sheet_to_json<{
          storeName: string;
          description: string;
        }>(worksheet);
        console.log(jsonData);
        setData(jsonData);
        setIsLoading(false);
      };
      reader.readAsBinaryString(file);
    }
  };

  return (
    <div>
      <h1>엑셀 파일 업로드</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <SaveToPdf filename="analysis_result1.pdf" isLoading={isLoading}>
        <h2>데이터</h2>
        <table>
          <thead>
            <tr>
              <th>Store Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.storeName}</td>
                <td>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </SaveToPdf>
    </div>
  );
}
