export const test = {
  style: "tableExample",
  color: "#444",
  table: {
    widths: [200, "auto", "auto"],
    headerRows: 2,
    body: [
      [
        {
          text: "Header with Colspan = 2",
          style: "tableHeader",
          colSpan: 2,
          alignment: "center",
        },
        {},
        { text: "Header 3", style: "tableHeader", alignment: "center" },
      ],
      [
        { text: "Header 1", style: "tableHeader", alignment: "center" },
        { text: "Header 2", style: "tableHeader", alignment: "center" },
        { text: "Header 3", style: "tableHeader", alignment: "center" },
      ],
      ["Sample value 1", "Sample value 2", "Sample value 3"],
      [
        {
          rowSpan: 3,
          text: "rowSpan set to 3\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor",
        },
        "Sample value 2",
        "Sample value 3",
      ],
      ["", "Sample value 2", "Sample value 3"],
      ["Sample value 1", "Sample value 2", "Sample value 3"],
      [
        "Sample value 1",
        {
          colSpan: 2,
          rowSpan: 2,
          text: "Both:\nrowSpan and colSpan\ncan be defined at the same time",
        },
        "",
      ],
      ["Sample value 1", "", ""],
    ],
  },
};
