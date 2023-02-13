import { Box, Heading, Container } from '@chakra-ui/react';
import WithLineBreaks from '@/components/utils/WithLineBreaks';
import type { Section } from 'src/lib/interfaces';
import castColorTheme from '../../utils/cast-color-theme';

const SectionHero = ({ section }: { section: Section<'SectionHero'> }) => {
  const { header, backgroundImage } = section;
  const colorTheme = castColorTheme(section.colorTheme);

  return (
    <Box
      bgImage={backgroundImage?.url ? backgroundImage.url : ''}
      backgroundSize='cover'
      backgroundPosition='center'
      backgroundBlendMode='overlay'
      backgroundColor='blackAlpha.400'
      display='flex'
      alignItems='center'
      as='section'
      color={colorTheme.contentColor}
    >
      <Container
        color='white'
        px={{ base: 8, md: 16 }}
        py={{ base: 48, sm: 72 }}
        minH={24}
        maxWidth='container.xl'
      >
        <Box>
          {header ? (
            <Heading fontSize='5xl' as='h1'>
              <WithLineBreaks text={header} />
            </Heading>
          ) : (
            <></>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default SectionHero;
