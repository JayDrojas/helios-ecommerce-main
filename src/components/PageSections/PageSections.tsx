import type { PageQuery } from '@/graphql/contentful';
import SectionHero from './sections/SectionHero';
import SectionCollectionShowcase from './sections/SectionCollectionShowcase';
import SectionProductShowcase from './sections/SectionProductShowcase';
import SectionDetailedShowcase from './sections/SectionDetailedShowcase';
import type { ShopifyDataMinimal } from 'src/lib/queries/get-page-data';
import SectionRichText from './sections/SectionRichText';

interface Props {
  sectionsCollection: NonNullable<
    NonNullable<PageQuery['pageCollection']>['items'][0]
  >['sectionsCollection'];
  shopifyData: ShopifyDataMinimal;
}

const PageSections = ({ sectionsCollection, shopifyData }: Props) => {
  if (!sectionsCollection) return <></>;

  const sections = sectionsCollection.items.map((section, index) => {
    if (!section) return;
    switch (section.__typename) {
      case 'SectionBlankTemplate':
        return;
      case 'SectionCollectionShowcase':
        return (
          <SectionCollectionShowcase
            key={index}
            section={section}
            shopifyData={shopifyData}
          />
        );
      case 'SectionDetailedLinkShowcase':
        return (
          <SectionDetailedShowcase
            key={index}
            section={section}
            shopifyData={shopifyData}
          />
        );
      case 'SectionDetailedProductShowcase':
        return (
          <SectionDetailedShowcase
            key={index}
            section={section}
            shopifyData={shopifyData}
          />
        );
      case 'SectionHero':
        return <SectionHero key={index} section={section} />;
      case 'SectionProductShowcase':
        return (
          <SectionProductShowcase
            key={index}
            section={section}
            shopifyData={shopifyData}
          />
        );
      case 'SectionRichText':
        return <SectionRichText key={index} section={section} />;
      default:
        return;
    }
  });

  return <>{sections}</>;
};

export default PageSections;
