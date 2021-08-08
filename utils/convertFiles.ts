import fs from 'fs';
import path from 'path';
import txtToJson from './txtToJson';

const convertFiles = (files: { inputName: string; outputName: string }[]) => {
  files.forEach((file) => {
    const summaryDataPath = path.join(
      process.cwd(),
      '/public/data/' + file.inputName
    );
    const summaryData = fs.readFileSync(summaryDataPath, 'utf8');

    const dataInJson = txtToJson(summaryData);

    const jsonData = dataInJson;
    const filePath = `${process.cwd()}/public/data/${file.outputName}.json`;
    fs.writeFileSync(filePath, dataInJson);
  });
};

export default convertFiles;
