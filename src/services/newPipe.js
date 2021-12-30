const fs = require('fs');
const rules = JSON.parse(fs.readFileSync('../rules/C2001.json'));

const C2001 = {
  totalCreditPoints: 144,
  additionalRules: [
    {
      name: 'Level 3 Credit Points Summation',
      category: 'creditPoints',
      tag: 3,
      targetValue: 36,
      evalOperator: 'eq',
      operation: 'sum',
    },
    {
      name: 'Level 1 Credit Points Summation',
      category: 'creditPoints',
      tag: 1,
      targetValue: 60,
      evalOperator: 'lte',
      operation: 'sum',
    },
  ],
  rules: {
    logical: '&&',
    aggregationRule: {
      targetValue: 2,
      name: 'Overall',
      value: 'creditPoints',
      evalOperator: 'mte',
      operation: 'count',
    },
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
        aggregationRule: {
          targetValue: 2,
          name: 'Level 3',
          value: 'creditPoints',
          evalOperator: 'mte',
          operation: 'sum',
        },
        group: [
          { code: 'FIT3abc', creditPoints: 0 },
          { code: 'FIT3122', creditPoints: 18 },
          { code: 'FIT3123', creditPoints: 18 },
          { code: 'FIT3199', creditPoints: 0 },
          { code: 'FIT3045', creditPoints: 18 },
        ],
      },
    ],
  },
};

const processAdditionalRules = (takenCourses, rule) => {
  const evalOperatorMapper = {
    eq: '==',
    lte: '<=',
    mte: '>=',
    mt: '>',
    lt: '<',
  };
  const { category, operation, tag, evalOperator } = rule;
  switch (category) {
    case 'creditPoints':
      let achievedValue = 0;
      switch (operation) {
        case 'sum':
          achievedValue = takenCourses.reduce((acc, currentCourse) => {
            return currentCourse.tag === tag
              ? acc + currentCourse.creditPoints
              : acc;
          }, 0);
          break;
        case 'count':
          achievedValue = takenCourses.reduce((acc, currentCourse) => {
            return currentCourse.tag === tag ? acc + 1 : acc;
          }, 0);
          break;
        default:
          break;
      }
      return {
        ...rule,
        achievedValue,
        passedRule: eval(
          `${achievedValue}${evalOperatorMapper[evalOperator]}${rule.targetValue}`,
        ),
      };
      break;
    default:
      break;
  }
};

const parseLogicObjectA = (
  { rules, additionalRules, totalCreditPoints },
  takenCourses,
) => {
  const coreRulesResults = checkRules(
    rules,
    takenCourses.map(({ code }) => code),
  );
  const additionalRulesResult = additionalRules.map((rule) =>
    processAdditionalRules(takenCourses, rule),
  );
  const creditsTakenByStudents = takenCourses.reduce(
    (prev, current) => prev + current.creditPoints,
    0,
  );

  return JSON.stringify({
    coreRulesResults,
    additionalRulesResult,
    creditsTakenByStudents,
    requiredCreditPoints: totalCreditPoints,
  });
};

const checkRules = (rules, takenCourses, aggregationRule = []) => {
  const { logical: logic, group, aggregationRule: agg } = rules;
  let curr = { result: undefined, fails: [] };
  const aggAggregation = agg ? [...aggregationRule, agg] : aggregationRule;

  for (let i = 0; i < group.length; i++) {
    let resolved;
    if (group[i].logical) {
      resolved = checkRules(group[i], takenCourses, aggAggregation);
      resolved = { ...resolved, child: true };
    } else {
      const failed = [];
      const isIn = takenCourses.includes(group[i].code);
      if (!isIn) failed.push(group[i]);
      resolved = { result: isIn, fails: failed };

      aggAggregation.forEach(({ name, value, operation }) => {
        switch (operation) {
          case 'sum':
            resolved = {
              ...resolved,
              [name]: isIn ? group[i][value] : 0,
            };
            break;
          case 'count':
            resolved = { ...resolved, [name]: isIn ? 1 : 0 };
            break;
          default:
            break;
        }
      });
    }

    aggAggregation.forEach(({ name, operation }) => {
      const returnedValue = resolved[name];
      switch (operation) {
        case 'sum':
          if (!curr[name]) curr = { ...curr, [name]: 0 };
          curr = { ...curr, [name]: curr[name] + (returnedValue || 0) };
          break;
        case 'count':
          if (!curr[name]) curr = { ...curr, [name]: 0 };
          curr = { ...curr, [name]: (curr[name] || 0) + returnedValue };
          break;
        default:
          break;
      }
    });

    console.log(curr, 'blaise ');

    const { result: rR, fails: rF, child } = resolved;
    const { result: cR, fails: cF } = curr;

    if (cR === undefined) curr = { ...curr, result: rR };
    else if (logic === '&&')
      curr = {
        ...curr,
        result: cR && rR,
        fails: cF.concat(rF),
      };
    else
      curr = {
        ...curr,
        result: cR || rR,
      };

    if (child)
      curr = {
        ...curr,
        ...remaining,
      };
  }

  if (!curr.result && logic === '||') {
    curr = {
      ...curr,
      fails: [...curr.fails, { chooseBy: 'OR', courses: group }],
    };
  }

  return curr;
};

// FE Button to upload file
// SEND to BE preprocess the csv
// Feed processed data into the parseLogicObjectA
// parseLogicObjectA will pick the suitable rule based on the student's info
// Parser does it's magic
// BE: Handle aggregation rule to return boolean and also statistics
// Prepare rules for courses in dummy data
// return required numbers for FE to display in table
// Export as Excel

console.log(
  parseLogicObjectA(C2001, [
    { code: 'FIT2014', creditPoints: 6, tag: 2 },
    { code: 'FIT1008', creditPoints: 6, tag: 1 },
    { code: 'MAT1830', creditPoints: 6, tag: 1 },
    { code: 'MAT1841', creditPoints: 6, tag: 1 },
    { code: 'FIT1045', creditPoints: 6, tag: 1 },
    { code: 'FIT2004', creditPoints: 6, tag: 2 },
    { code: 'FIT1047', creditPoints: 6, tag: 1 },
    { code: 'FIT2014', creditPoints: 6, tag: 2 },
    { code: 'FIT3abc', creditPoints: 0 },
    { code: 'FIT3122', creditPoints: 18 },
    { code: 'FIT3123', creditPoints: 18 },
    { code: 'FIT3199', creditPoints: 0 },
    { code: 'FIT3045', creditPoints: 18 },
  ]),
);

// 48 + 54 => 102
