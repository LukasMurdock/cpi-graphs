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
  console.log('Cleaning: ' + inputFile);
  const outputPath = path.join(process.cwd(), '/public/data/' + outputFile);
  const initialDataFilepath = path.join(
    process.cwd(),
    '/public/data/' + inputFile
  );

  const initialData = JSON.parse(fs.readFileSync(initialDataFilepath, 'utf8'));

  //   console.log(fields);

  const outputData = initialData.map((cell: any) => {
    const newObject = {} as any;
    fields.forEach((field) => {
      newObject[field] = cell[field];
    });

    return { ...newObject };
  });

  //   console.log(outputData);

  fs.writeFileSync(outputPath, JSON.stringify(outputData));

  //   const outputData = initialData.map((x:any) => [{series_id: x['series_id'], item_code: x['item_code'], series_title: x['series_title']}])
  //   const outputData = initialData.map((row: any) => ({ series_id } = row));
};

export default cleanData;
