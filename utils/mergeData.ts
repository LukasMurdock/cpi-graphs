import fs from 'fs';
import path from 'path';
import mergeByProperty from './mergeByProperty';

const mergeData = ({
  outputFile,
  joinFile,
  initialFile
}: {
  outputFile: string;
  initialFile: string;
  joinFile: { source: string; joinProp: string }[];
}) => {
  const outputPath = path.join(process.cwd(), '/public/data/' + outputFile);
  const initialDataFilepath = path.join(
    process.cwd(),
    '/public/data/' + initialFile
  );

  const initialData = fs.readFileSync(initialDataFilepath, 'utf8');
  //   initialDataJson = JSON.parse(initialData)
  // Create output file with initial data
  fs.writeFileSync(outputPath, initialData);
  console.log('Merge Status: Initial file created: ' + outputFile);

  joinFile.forEach((file) => {
    const joinFilepath = path.join(
      process.cwd(),
      '/public/data/' + file.source
    );
    console.log('Merge Status: Reading ' + file.source);
    const joinData = JSON.parse(fs.readFileSync(joinFilepath, 'utf8'));
    const outputData = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
    console.log(
      'Merge Status: Merging ' + file.source + ' on ' + file.joinProp
    );
    const mergeStartTime = new Date();
    // console.log([outputData[0]]);
    // console.log(joinData);
    // console.log(file.joinProp);
    // DEBUG: mergeByProperty([outputData[0]], joinData, file.joinProp);
    mergeByProperty(outputData, joinData, file.joinProp);
    const mergeEndTime = new Date();
    console.log(
      'Merge Status: Merged ' +
        file.source +
        ' in ' +
        (mergeEndTime.getTime() - mergeStartTime.getTime()) / 1000 +
        ' seconds'
    );

    console.log(outputData[50]);

    fs.writeFileSync(outputPath, JSON.stringify(outputData));
  });
};

export default mergeData;
