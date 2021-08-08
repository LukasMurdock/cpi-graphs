// https://stackoverflow.com/questions/36120265/how-to-convert-text-file-to-json-in-javascript
// https://stackoverflow.com/a/36120656/12161293

// Modified regex to match spaces and tab
// Added replace for carriage return \r

const txtToJson = (txt: string) => {
  const cells = txt.split('\n').map(function (el) {
    return el.replace('\r', '').split(/\s*\t+\s*/);
  });

  const headings = cells.shift();

  if (headings) {
    const obj = cells.map(function (el) {
      const obj = {} as any;
      for (var i = 0, l = el.length; i < l; i++) {
        obj[headings[i]] = isNaN(Number(el[i])) ? el[i] : +el[i];
      }
      return obj;
    });
    return JSON.stringify(obj);
  } else {
    return '';
  }
};

export default txtToJson;
