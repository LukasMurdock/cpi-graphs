// https://stackoverflow.com/a/20221897/12161293

// Modified to iterate over target instead of source
// This way it matches every month instead of just the first time it sees that month

// const mergeByProperty = (target: object[], source: object[], prop: string) => {
//   source.forEach((sourceElement: any) => {
//     let targetElement = target.find((targetElement: any) => {
//       return sourceElement[prop] === targetElement[prop];
//     });
//     targetElement
//       ? Object.assign(targetElement, sourceElement)
//       : target.push(sourceElement);
//   });
// };

const mergeByProperty = (target: object[], source: object[], prop: string) => {
  target.forEach((targetElement: any) => {
    let sourceElement = source.find((sourceElement: any) => {
      return targetElement[prop] === sourceElement[prop];
    });
    sourceElement && Object.assign(targetElement, sourceElement);
  });
};

export default mergeByProperty;
