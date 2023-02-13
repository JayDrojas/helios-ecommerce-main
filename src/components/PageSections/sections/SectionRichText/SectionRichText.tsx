import type { Maybe, Section } from 'src/lib/interfaces';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Box, Container } from '@chakra-ui/react';
import renderOptions from '../../utils/render-options';
import castColorTheme from '../../utils/cast-color-theme';
import type { MetaColorTheme } from '@/graphql/contentful';
interface Props {
  section: Section<'SectionRichText'>;
}

const SectionRichText = ({ section }: Props) => {
  const colorTheme = castColorTheme(
    section.colorTheme as Maybe<MetaColorTheme>
  );
  return (
    <>
      <Box
        backgroundColor={colorTheme.backgroundColor}
        color={colorTheme.contentColor}
        as='section'
      >
        <Container maxW='container.xl' py={24} px={{ base: 4, md: 16 }}>
          {section.sectionRichText?.links
            ? documentToReactComponents(
                section.sectionRichText?.json,
                renderOptions(section.sectionRichText?.links)
              )
            : ''}
        </Container>
      </Box>
    </>
  );
};

export default SectionRichText;
