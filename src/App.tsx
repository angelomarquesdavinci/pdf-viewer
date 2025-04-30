/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef } from "react";
import "./App.css";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Cnae, wasteClassifications } from "./constant";
import { document } from "./document-example";
import { render as render_campo_largo_pgrss_template } from "./pgrss/campo-largo";
import { render as render_ampere_template } from "./pgrss/ampere";
import { render as render_default_template } from "./default-template";
import { render as render_pgrss_state_santa_catarina_template } from "./pgrss/state-santa-catarina";

// Set the fonts
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const fonts = {
  Helvetica: {
    normal: `${window.location.origin}/fonts/helvetica/default.ttf`,
    // italics: `${window.location.origin}/fonts/Helvetica/times-new-roman-italic.ttf`,
    bold: `${window.location.origin}/fonts/helvetica/bold.ttf`,
    // bolditalics: `${window.location.origin}/fonts/Helvetica/times-new-roman-bold-italic.ttf`,
  },
  TimesNewRoman: {
    normal: `${window.location.origin}/fonts/TimesNewRoman/times-new-roman.ttf`,
    italics: `${window.location.origin}/fonts/TimesNewRoman/times-new-roman-italic.ttf`,
    bold: `${window.location.origin}/fonts/TimesNewRoman/times-new-roman-bold.ttf`,
    bolditalics: `${window.location.origin}/fonts/TimesNewRoman/times-new-roman-bold-italic.ttf`,
  },
  Arial: {
    normal: `${window.location.origin}/fonts/arial/arial.ttf`,
    italics: `${window.location.origin}/fonts/arial/arial-italic.ttf`,
    bold: `${window.location.origin}/fonts/arial/arial-bold.ttf`,
    bolditalics: `${window.location.origin}/fonts/arial/arial-bold-italic.ttf`,
  },
};

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
  const pdfDocGenerator = pdfMake.createPdf(
    render_pgrss_state_santa_catarina_template({
      classifications: wasteClassifications,
      cnaes: Cnae,
      document: document,
      techinical: {
        id: "171c0b54-3e27-41ce-a49b-c67689435ddc",
        professionalClass: {
          identity: "09202481",
          institution: "CRQ IX",
        },
        company: {
          address: {
            city: "Curitiba",
            complement: "cj 102",
            neighborhood: "Centro",
            number: 467,
            state: "PR",
            street: "Vicente Machado",
            zip: "80420010",
          },
          email: "pedro@davinciambiental.com.br",
          identity: "19824514000190",
          name: "DAVINCI CONSULTORIA E PROJETOS AMBIENTAIS LTDA",
          tradeName: "DAVINCI AMBIENTAL",
        },
        createdAt: 1712931897,
        email: "angelo@davinciambiental.com.br",
        name: "Ângelo Tech",
        password:
          "31041ea53b10$bea40e3d4e4a0160bb3ac56a00c4465cf22b8aa69e3cd01718e808f74988af68e24c36a7c15c7bd7cd0ad5e6c68e6773027d23603df167c18f6f2472ce5f7b50",
        phone: "4130114500",
        position: "Químico Ambiental",
        profile: 1,
        status: 2,
        updatedAt: 1715085266,
        username: "00000000000119",
        identityNumber: "13562171",
      },
      isApproved: false,
    }),
    {},
    fonts
  );

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
