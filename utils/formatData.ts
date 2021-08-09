import fs from 'fs';
import path from 'path';

const formatData = ({
  inputFile,
  outputFile,
  format,
  fields
}: {
  inputFile: string;
  outputFile: string;
  format: any;
  fields?: string[];
}) => {
  const outputPath = path.join(process.cwd(), '/public/data/' + outputFile);
  const initialDataFilepath = path.join(
    process.cwd(),
    '/public/data/' + inputFile
  );

  const initialData = JSON.parse(fs.readFileSync(initialDataFilepath, 'utf8'));

  const outputData = initialData.map((cell: any) => {
    const newObject = {} as any;
    for (const formatCell in format) {
      newObject[formatCell] = format[formatCell](cell);
    }

    fields &&
      fields.forEach((field) => {
        newObject[field] = cell[field];
      });

    return fields
      ? { ...newObject }
      : format
      ? { ...cell, ...newObject }
      : cell;
  });

  console.log(outputData[0]);
  fs.writeFileSync(outputPath, JSON.stringify(outputData));
  console.log('Formatted: ' + inputFile);
};

export default formatData;
