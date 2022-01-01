// import { getRules } from 'src/helpers/helpers';
const fs = require('fs');

const getRules = (courseCode) => {
  return JSON.parse(fs.readFileSync(`../rules/${courseCode}.json`));
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
    default:
      break;
  }
};

const parseLogicObjectA = (
  { isInternational = false, courseCode = 'C2001' },
  takenCourses,
) => {
  const { rules, additionalRules, totalCreditPoints } = getRules(courseCode);

  // Inject additional rules
  const { rules: MPUInter } = getRules('MPU_International');
  const { rules: MPULocal } = getRules('MPU_local');
  rules.group = [...rules.group, isInternational ? MPUInter : MPULocal];

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

const checkRules = (rules, subject, prevAggRules = []) => {
  const { logical, aggregationRule, group } = rules;
  let result = undefined;
  let recRes = [];
  let fails = [];

  //Adds the current aggegation rule if any
  const currAggRules = Boolean(aggregationRule)
    ? [...prevAggRules, aggregationRule]
    : prevAggRules;

  group.forEach((r) => {
    if (Boolean(r.logical)) {
      const resolved = checkRules(r, subject, currAggRules);
      const { result: res, fails: fa, ...remain } = resolved;
      if (!Boolean(result)) result = res;
      else if (logical === '&&') result = result && res;
      else if (logical === '||') result = result || res;
      fails = fails.concat(fa);
      recRes.push(remain);
    } else {
      const isIn = subject.includes(r.code);
      if (!isIn) fails.push(r);
      //else passed.push(r);
      if (!Boolean(result)) result = isIn;
      else if (logical === '&&') result = result && isIn;
      else if (logical === '||') result = result || isIn;
    }
  });

  if (logical === '||') {
    if (fails.length !== group.length) fails = [];
    else fails = [{ operation: 'OR', fails }];
  }

  return {
    result,
    fails,
    // ...resAgg,
  };
};

const operationDecider = (operation, value1, value2) => {
  switch (operation) {
    case 'sum':
      return value1 + value2;
    case 'count':
      return value1 + 1;
    default:
      return value1;
  }
};

console.log(
  parseLogicObjectA({ isInternational: true }, [
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
