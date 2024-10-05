import React, { useEffect, useState } from "react";
import axios from "axios";

function PrintoutPage() {
  const [pdfFiles, setPdfFiles] = useState([]);

  useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/api/upload/");
        const documents = response.data.documents;

        const allFiles = documents.map((document) => ({
          id: document._id,
          username: document.username,
          uploadDate: document.uploadDate,
          files: document.files.map((file) => ({
            id: file._id,
            name: file.name,
          })),
        }));

        setPdfFiles(allFiles);
      } catch (error) {
        console.error("Error fetching PDF files:", error);
      }
    };

    fetchPdfFiles();
  }, []);

  const removeFileBunch = async (parentToRemove) => {
    try {
      const updatedFiles = pdfFiles.filter(
        (parent) => parent.id !== parentToRemove.id
      );
      setPdfFiles(updatedFiles);
      const response = await axios.delete(
        `http://127.0.0.1:5000/api/upload/${parentToRemove.id}`
      );
      if (response.status === 404) {
        console.log("encountered error");
      }
      window.location.reload();
    } catch (err) {
      console.error("Error removing file:", err);
    }
  };

  const downloadFile = async (fileId, parentId, fileName) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/api/upload/${parentId}`,
        {
          responseType: "blob",
          params: {
            fileId: fileId,
          },
        }
      );
      const blob = response.data;

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Changed file.name to fileName
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <h1>Printout Page</h1>
      <div>
        {pdfFiles.map((parent) => (
          <div className="user-print" key={parent.id}>
            {parent.files.map((file) => (
              <div key={file.id} className="file-print">
                <p>
                  {parent.username} - {parent.uploadDate}
                </p>
                <button
                  className="btn-2"
                  onClick={() => downloadFile(file.id, parent.id, file.name)}
                >
                  Download {"\u00A0\u00A0\u00A0\u00A0"} {file.name}
                </button>
              </div>
            ))}
            <button className="btn-1" onClick={() => removeFileBunch(parent)}>
              Done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrintoutPage;
