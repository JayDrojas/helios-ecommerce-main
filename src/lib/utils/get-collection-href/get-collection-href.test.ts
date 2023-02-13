import getCollectionHref from './get-collection-href';

describe(getCollectionHref, () => {
  test('returns href to be used as collection link', () => {
    expect(getCollectionHref('new-releases')).toBe('/collections/new-releases');
  });
});
