// const parseLogic = (obj) => {
//   const logic = obj.logical;
//   let currentString = '';
//   for (let i = 0; i < obj.group.length; i++) {
//     const end = i === obj.group.length - 1 ? '' : logic;
//     let resolved;
//     if (obj.group[i].logical) resolved = `(${parseLogic(obj.group[i])})`;
//     else resolved = obj.group[i].code; // base case
//     currentString = `${currentString} ${resolved} ${end}`;
//   }
//   return currentString;
// };

// const parseLogicArray = (obj, array, fails = []) => {
//   const flatten = array.map(({ code }) => code);
//   const logic = obj.logical;
//   let currentBoolean = undefined;
//   for (let i = 0; i < obj.group.length; i++) {
//     let resolved;
//     if (obj.group[i].logical)
//       resolved = parseLogicArray(obj.group[i], array, fails);
//     else resolved = flatten.includes(obj.group[i].code); // base case

//     if (currentBoolean === undefined) currentBoolean = resolved;
//     else if (logic === '&&') currentBoolean = currentBoolean && resolved;
//     else currentBoolean = currentBoolean || resolved;

//     if (!resolved && currentBoolean === '&&') fails.push(obj.group[i]);
//   }
//   if (!currentBoolean && currentBoolean === '||')
//     fails = fails.concat(obj.group);

//   return currentBoolean;
// }
