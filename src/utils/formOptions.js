const optionGroups = {
  vacancies: {
    question: 'How many vacancies do you have?',
    options: [
      { id: 'V_1_5', label: '1-5 units', min: 1, max: 5, defaultValue: 3 },
      { id: 'V_6_10', label: '6-10 units', min: 6, max: 10, defaultValue: 8 },
      { id: 'V_11_25', label: '11-25 units', min: 11, max: 25, defaultValue: 18 },
      { id: 'V_26_50', label: '26-50 units', min: 26, max: 50, defaultValue: 38 },
      { id: 'V_51_100', label: '51-100 units', min: 51, max: 100, defaultValue: 75 },
      { id: 'V_100_PLUS', label: '100+ units', min: 100, max: 150, defaultValue: 100 }
    ]
  },
  daysVacant: {
    question: 'How many days does each property sit vacant?',
    options: [
      { id: 'D_LT_7', label: 'Less than 7 days', min: 0, max: 6, defaultValue: 6 },
      { id: 'D_7_14', label: '7-14 days', min: 7, max: 14, defaultValue: 10 },
      { id: 'D_15_30', label: '15-30 days', min: 15, max: 30, defaultValue: 22 },
      { id: 'D_1_2_MONTHS', label: '1-2 months', min: 30, max: 60, defaultValue: 45 },
      { id: 'D_2_3_MONTHS', label: '2-3 months', min: 60, max: 90, defaultValue: 75 },
      { id: 'D_3_PLUS_MONTHS', label: '3+ months', min: 90, max: 120, defaultValue: 90 }
    ]
  },
  monthlyRent: {
    question: 'What is the average rent per month?',
    options: [
      { id: 'R_UNDER_500', label: 'Under $500', min: 250, max: 500, defaultValue: 400 },
      { id: 'R_500_1000', label: '$500 - $1,000', min: 500, max: 1000, defaultValue: 750 },
      { id: 'R_1000_1500', label: '$1,000 - $1,500', min: 1000, max: 1500, defaultValue: 1250 },
      { id: 'R_1500_2000', label: '$1,500 - $2,000', min: 1500, max: 2000, defaultValue: 1750 },
      { id: 'R_2000_3000', label: '$2,000 - $3,000', min: 2000, max: 3000, defaultValue: 2500 },
      { id: 'R_3000_5000', label: '$3,000 - $5,000', min: 3000, max: 5000, defaultValue: 4000 },
      { id: 'R_5000_PLUS', label: '$5,000+', min: 5000, max: 7000, defaultValue: 5000 }
    ]
  },
  showTimeHours: {
    question: 'How long does it take to show an apartment?',
    options: [
      { id: 'T_LT_15_MIN', label: 'Less than 15 minutes', min: 0.1, max: 0.25, defaultValue: 0.25 },
      { id: 'T_15_30_MIN', label: '15-30 minutes', min: 0.25, max: 0.5, defaultValue: 0.375 },
      { id: 'T_30_60_MIN', label: '30-60 minutes', min: 0.5, max: 1, defaultValue: 0.75 },
      { id: 'T_1_2_HOURS', label: '1-2 hours', min: 1, max: 2, defaultValue: 1.5 },
      { id: 'T_2_PLUS_HOURS', label: '2+ hours', min: 2, max: 3, defaultValue: 2 }
    ]
  }
};

function listFormQuestions() {
  return Object.entries(optionGroups).map(([key, group]) => ({
    id: key,
    question: group.question,
    options: group.options.map((option) => ({
      id: option.id,
      label: option.label,
      min: option.min,
      max: option.max
    }))
  }));
}

function findOption(groupName, optionId) {
  const group = optionGroups[groupName];
  if (!group) {
    return undefined;
  }
  return group.options.find((option) => option.id === optionId);
}

function normalizeSelection(groupName, selection = {}) {
  if (!selection || (typeof selection !== 'object')) {
    throw new Error(`Selection for ${groupName} is required.`);
  }

  const { optionId, value } = selection;
  let numericValue;
  let label;

  if (value !== undefined) {
    const parsedValue = Number(value);
    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      throw new Error(`${groupName} value must be a positive number.`);
    }
    numericValue = parsedValue;
  }

  if (optionId) {
    const option = findOption(groupName, optionId);
    if (!option) {
      throw new Error(`Invalid optionId '${optionId}' for ${groupName}.`);
    }
    label = option.label;
    if (numericValue === undefined) {
      numericValue = option.defaultValue;
    }
  }

  if (numericValue === undefined) {
    throw new Error(`Provide either optionId or value for ${groupName}.`);
  }

  return { value: numericValue, label: label || String(numericValue) };
}

module.exports = {
  optionGroups,
  listFormQuestions,
  normalizeSelection
};
