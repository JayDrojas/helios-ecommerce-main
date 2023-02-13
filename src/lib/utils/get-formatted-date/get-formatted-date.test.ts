import getFormattedDate from '.';

describe(getFormattedDate, () => {
  test('Transforms date to a formatted date in month, day, year format.', () => {
    // 2022-12-15T06:23:53Z
    const date = '2022-12-15T06:23:53Z';
    const loc = 'EN';
    const result = getFormattedDate(date, loc, 'America/New_York');
    const expected = 'December 15, 2022';
    expect(result).toBe(expected);
  });
  test('Transforms date to a formatted date in month, day, year format. 2019-09-07T15:50:00Z should print out September 7, 2019', () => {
    // 2022-12-15T06:23:53Z
    const date = '2019-09-07T15:50:00Z';
    const loc = 'EN';
    const result = getFormattedDate(date, loc, 'America/New_York');
    const expected = 'September 7, 2019';
    expect(result).toBe(expected);
  });
});
