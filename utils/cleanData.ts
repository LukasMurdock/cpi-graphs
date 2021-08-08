import fs from 'fs';
import path from 'path';

const cleanData = ({
  inputFile,
  outputFile,
  fields
}: {
  inputFile: string;
  outputFile: string;
  fields: string[];
}) => {
  const outputPath = path.join(process.cwd(), '/public/data/' + outputFile);
  const initialDataFilepath = path.join(
    process.cwd(),
    '/public/data/' + inputFile
  );

  const initialData = JSON.parse(fs.readFileSync(initialDataFilepath, 'utf8'));

  console.log(fields);
  //   const outputData = initialData.map((row: any) => ({ series_id } = row));
};

export default cleanData;
