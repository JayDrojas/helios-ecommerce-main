import getFormattedCost from '.';

describe(getFormattedCost, () => {
  test('Transforms number price and currency code to viewable price text.', () => {
    const result = getFormattedCost(12499.99, 'USD');
    const expected = '$12,499.99';
    expect(result).toBe(expected);
  });
  test('Transforms string price and currency code to viewable price text.', () => {
    const result = getFormattedCost('420.99', 'USD');
    const expected = '$420.99';
    expect(result).toBe(expected);
  });
  test('Works with other currency code (MXN).', () => {
    const result = getFormattedCost(193.43, 'MXN');
    const expected = 'MX$193.43';
    expect(result).toBe(expected);
  });
  test('Works with other currency code (JPY).', () => {
    const result = getFormattedCost('27000', 'JPY');
    const expected = '¥27,000';
    expect(result).toBe(expected);
  });
});
