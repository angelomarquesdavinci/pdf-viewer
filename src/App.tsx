import { useRef } from "react";
import "./App.css";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { fbTemplate } from "./template";

// Set the fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function App() {
  const iframe = useRef<HTMLIFrameElement>(null);

  // Define your PDF document here (e.g., docDefinition)
  // const docDefinition = {
  //   content: [
  //     { text: "Hello PDFMake in React changing testing!", fontSize: 20 },
  //     "More content here...",
  //   ],
  // };

  // Generate the PDF
  const pdfDocGenerator = pdfMake.createPdf(fbTemplate);

  // Get the data URL and set it as the source of an iframe
  try {
    pdfDocGenerator.getDataUrl((dataUrl) => {
      // const iframe = document.createElement('iframe');
      if (!iframe.current) return;
      iframe.current.src = dataUrl;

      // // Assuming you have an element with the ID 'iframeContainer' to append the iframe
      // const targetElement = document.querySelector("#iframeContainer");
      // targetElement.innerHTML = ""; // Clear existing content
      // targetElement.appendChild(iframe);
    });
  } catch (err) {
    console.log("error ");
  }
  console.log("rendered");

  // function generateAndDisplayPDF() {
  //   pdfMake.createPdf(fbTemplate).print();
  // }

  return (
    <>
      <iframe style={{ width: "100vw", height: "100vh" }} ref={iframe}></iframe>

      {/* <button onClick={generateAndDisplayPDF}>print</button> */}
    </>
  );
}

export default App;
