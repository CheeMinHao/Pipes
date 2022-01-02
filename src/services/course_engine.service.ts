import { Injectable, BadRequestException } from '@nestjs/common';
import { getRules } from 'src/helpers/helpers';

@Injectable()
export class CourseEngineService {
  private async operationDecider(operation, value1, value2) {
    switch (operation) {
      case 'sum':
        return value1 + value2;
      case 'count':
        return value1 + 1;
      default:
        return value1;
    }
  }

  private processAdditionalRules(takenCourses, rule) {
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
  }

  private checkRules(rules, subject, prevAggRules = []) {
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
        const resolved = this.checkRules(r, subject, currAggRules);
        const { result: res, fails: fa, ...remain } = resolved;
        if (!Boolean(result)) result = res;
        else if (logical === '&&') result = result && res;
        else if (logical === '||') result = result || res;
        fails = fails.concat(fa);
        recRes.push(remain);
      } else {
        const isIn = subject.includes(r.code);
        if (!isIn) fails.push(r);
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
    };
  }

  processStudent({ isInternational, courseCode }, takenCourses) {
    const { rules, additionalRules, totalCreditPoints } = getRules(courseCode);

    // Inject additional rules
    const { rules: MPUInter } = getRules('MPU_International');
    const { rules: MPULocal } = getRules('MPU_local');
    rules.group = [...rules.group, isInternational ? MPUInter : MPULocal];

    const coreRulesResults = this.checkRules(
      rules,
      takenCourses.map(({ code }) => code),
    );

    const additionalRulesResult = additionalRules.map((rule) =>
      this.processAdditionalRules(takenCourses, rule),
    );

    const creditsTakenByStudents = takenCourses.reduce(
      (prev, current) => prev + current.creditPoints,
      0,
    );

    return {
      coreRulesResults,
      additionalRulesResult,
      creditsTakenByStudents,
      requiredCreditPoints: totalCreditPoints,
    };
  }

  processStudentBulk = (jsonList: any[]) => {
    const students = {};
    jsonList.forEach((obj) => {
      const { 'Person ID': id } = obj;
      if (!students[id]) students[id] = [];
      students[id].push({ ...obj, code: obj['UNIT_CD'], creditPoints: 6 });
    });

    return Object.keys(students).map((key) => {
      const currentStudent = students[key][0];
      return {
        studentID: currentStudent['Person ID'],
        course: `${currentStudent['COURSE_CD']} ${currentStudent['CRS_TITLE']}`,
        name: `${currentStudent['Given names']} ${currentStudent['Surname']}`,
        takenUnits: students[key].map(({ code }) => code),
        result: this.processStudent(
          {
            isInternational: true,
            courseCode: currentStudent['COURSE_CD'],
          },
          students[key],
        ),
      };
    });
  };
}
