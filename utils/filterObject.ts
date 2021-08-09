import fs from 'fs';
import path from 'path';

const filterObject = ({
  inputFile,
  outputFile,
  filterFunction
}: {
  inputFile: string;
  outputFile: string;
  filterFunction: any;
}) => {
  const outputPath = path.join(process.cwd(), '/public/data/' + outputFile);
  const initialDataFilepath = path.join(
    process.cwd(),
    '/public/data/' + inputFile
  );

  const initialData = JSON.parse(fs.readFileSync(initialDataFilepath, 'utf8'));

  const outputData = initialData.filter(filterFunction);

  //   console.log(outputData);
  fs.writeFileSync(outputPath, JSON.stringify(outputData));
  console.log('Filtered: ' + inputFile);
};

export default filterObject;

// let bigCities = cities.filter(function (e) {
//     return e.population > 3000000;
//   });
