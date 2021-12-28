const GeneralStudies = {
  localGeneralStudies: [
    { code: 'MPU3113', creditPoint: 0 },
    { code: 'MPU3123', creditPoint: 0 },
    { code: 'MPU3212', creditPoint: 0 },
  ],
  internationalGeneralStudies: [
    { code: 'MPU3143', creditPoint: 0 },
    { code: 'MPU3173', creditPoint: 0 },
  ],
};

const studentData = {
  isLocal: true,
  course: 'C2001 ',
  takenUnits: [
    { code: 'FIT2014', creditPoints: 6 },
    { code: 'FIT2102', creditPoints: 6 },
    { code: 'HAHA123', creditPoints: 18 },
  ],
};

const courseRelatedData = {
  course: 'C2001 ',
  creditToCompleteCourse: 144,
  coreUnits: [
    { code: 'FIT2014', creditPoints: 6 },
    { code: 'FIT1008', creditPoints: 6 },
    { code: 'MAT1830', creditPoints: 6 },
    { code: 'MAT1841', creditPoints: 6 },
    { code: 'FIT1045', creditPoints: 6 },
    { code: 'FIT2004', creditPoints: 6 },
    { code: 'FIT1047', creditPoints: 6 },
    { code: 'FIT2014', creditPoints: 6 },
  ],
  mandatoryNonCoreUnits: [
    {
      logical: '||',
      group: [
        { code: 'FIT3199', creditPoints: 0 },
        { code: 'HAHA123', creditPoints: 18 },
      ],
    },
  ],
};

const C2001DS = (extraParam = {}, extraValid = {}) => ({
  extraValidation: [
    { rule: 'levelCheck3', result: 36 },
    { rule: 'levelCheck2', result: 36 },
    ...extraValid,
  ],
  rules: {
    logical: '&&',
    group: [
      { code: 'FIT2014', creditPoints: 6, tag: 2 },
      { code: 'FIT1008', creditPoints: 6, tag: 1 },
      { code: 'MAT1830', creditPoints: 6, tag: 1 },
      { code: 'MAT1841', creditPoints: 6, tag: 1 },
      { code: 'FIT1045', creditPoints: 6, tag: 1 },
      { code: 'FIT2004', creditPoints: 6, tag: 2 },
      { code: 'FIT1047', creditPoints: 6, tag: 1 },
      { code: 'FIT2014', creditPoints: 6, tag: 2 },
      {
        logical: '||',
        group: [
          { code: 'FIT3199', creditPoints: 0 },
          { code: 'FIT3045', creditPoints: 18 },
        ],
      },
      ...extraParam,
    ],
  },
});

const parseLogic = (obj) => {
  const logic = obj.logical;
  let currentString = '';
  for (let i = 0; i < obj.group.length; i++) {
    const end = i === obj.group.length - 1 ? '' : logic;
    let resolved;
    if (obj.group[i].logical) resolved = `(${parseLogic(obj.group[i])})`;
    else resolved = obj.group[i].code; // base case
    currentString = `${currentString} ${resolved} ${end}`;
  }
  return currentString;
};

const parseLogicArray = (obj, array) => {
  const flatten = array.map(({ code }) => code);
  const logic = obj.logical;
  let currentBoolean;
  for (let i = 0; i < obj.group.length; i++) {
    let resolved;
    if (obj.group[i].logical) {
      resolved = parseLogicArray(obj.group[i], array);
    } else {
      resolved = flatten.includes(obj.group[i].code); // base case
    }
    !currentBoolean
      ? (currentBoolean = resolved)
      : (currentBoolean =
          logic === '&&'
            ? currentBoolean && resolved
            : currentBoolean || resolved);
  }
  return currentBoolean;
};

console.log(
  parseLogicArray(
    {
      logical: '&&',
      group: [
        { code: 'FIT2014', creditPoints: 6, tag: 2 },
        { code: 'FIT1008', creditPoints: 6, tag: 1 },
        { code: 'MAT1830', creditPoints: 6, tag: 1 },
        { code: 'MAT1841', creditPoints: 6, tag: 1 },
        { code: 'FIT1045', creditPoints: 6, tag: 1 },
        { code: 'FIT2004', creditPoints: 6, tag: 2 },
        { code: 'FIT1047', creditPoints: 6, tag: 1 },
        {
          logical: '&&',
          group: [
            { code: 'FIT3199', creditPoints: 0 },
            { code: 'FIT3045', creditPoints: 18 },
          ],
        },
      ],
    },
    [
      { code: 'FIT2014', creditPoints: 6, tag: 2 },
      { code: 'MAT1830', creditPoints: 6, tag: 1 },
      { code: 'MAT1841', creditPoints: 6, tag: 1 },
      { code: 'FIT1045', creditPoints: 6, tag: 1 },
      { code: 'FIT2004', creditPoints: 6, tag: 2 },
      { code: 'FIT1047', creditPoints: 6, tag: 1 },
      { code: 'FIT3199', creditPoints: 0 },
      { code: 'FIT3045', creditPoints: 18 },
    ],
  ),
);

// +(FIT3199 || HAHA123 ) || asdsad32432432  || (21321 && abc)+ && +(123)+

/** Return a boolean whether student is eligible to graduate
 *True- Student is eligible to graduate
 */
const evaluatePipe = (
  { isLocal, course, takenUnits },
  { creditToCompleteCourse, coreUnits, mandatoryNonCoreUnits },
) => {
  // Evaluation
  // checkCredit points
  const currentCreditPoints = takenUnits
    .concat(mandatoryNonCoreUnits)
    .reduce((prev, { creditPoints }) => prev + creditPoints, 0);
  const percentage = currentCreditPoints / creditToCompleteCourse;

  // check GS courses
  const requiredGeneralStudiesSubjects = isLocal
    ? GeneralStudies.localGeneralStudies
    : GeneralStudies.internationalGeneralStudies;
  const gSStatusBreakdown = _similarDifference(
    takenUnits,
    requiredGeneralStudiesSubjects,
    'code',
  );

  // check core units
  const coreStatusBreakdown = _similarDifference(takenUnits, coreUnits, 'code');
  const passCreditPoints = percentage >= 1;
  const passCoreUnits =
    coreStatusBreakdown.completed === coreStatusBreakdown.total;
  const passGeneralStudies =
    gSStatusBreakdown.completed === gSStatusBreakdown.total;
  const passedLevelChecks = needCheckLevel
    ? _checkNumberOfCreditsLevel(takenUnits, 3, 36)
    : true;

  return {
    canGraduate:
      passCreditPoints &&
      passCoreUnits &&
      passGeneralStudies &&
      passedLevelChecks,
    creditPointPercentage: percentage,
  };
};

const _checkNumberOfCreditsLevel = (
  takenUnits,
  levelToCheck,
  creditsRequired,
) => {
  let total = 0;
  for (let i = 0; i < takenUnits.length; i++) {
    if (takenUnits[i].level === levelToCheck) {
      total += unit.creditPoint;
      if (total === creditsRequired) {
        return true;
      }
    }
  }
  return false;
};

const _setIntersection = (a, b, compareBy) => {
  var setA = new Set(a.map((a) => a[compareBy]));
  var setB = new Set(b.map((b) => b[compareBy]));
  var intersection = new Set([...setA].filter((x) => setB.has(x)));
  return Array.from(intersection);
};

const _similarDifference = (comparee, comparedTo, compareBy) => {
  const comparedToLength = comparedTo.length;
  const intersectArrayLength = _setIntersection(
    comparee,
    comparedTo,
    compareBy,
  ).length;

  return {
    completed: intersectArrayLength,
    incompleted: comparedToLength - intersectArrayLength,
    total: comparedToLength,
  };
};

/**
 * Return a number that represents a percentage
 * Core Units, Internship, General Studies
 */

/**
 * Malaysian Students	
  MPU3113 Ethnic Relations
  MPU3123 Islamic and Asian Civilisations
  MPU3212 National Language A	

  International Students
  MPU3143 Communicative Malay 2
  MPU3173 Malaysian Studies 3
 */
