import type { Section } from '@/lib/interfaces';
import {
  TableContainer,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Text,
  Box,
  Image,
  Link,
  UnorderedList,
  ListItem,
  OrderedList,
  Divider
} from '@chakra-ui/react';
import NextLink from 'next/link';
import type { Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Node } from '@contentful/rich-text-types';
import { LinkIcon } from '@chakra-ui/icons';

export default function renderOptions(
  links: NonNullable<
    NonNullable<
      NonNullable<Section<'SectionRichText'>['sectionRichText']>['links']
    >
  >
): Options {
  // create an asset map
  const assetMap = new Map();
  // loop through the assets and add them to the map
  for (const asset of links.assets.block) {
    if (asset) {
      assetMap.set(asset.sys.id, asset);
    }
  }

  // create an entry map
  const entryMap = new Map();
  // loop through the block linked entries and add them to the map
  for (const entry of links.entries.block) {
    if (entry) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  // loop through the inline linked entries and add them to the map
  for (const entry of links.entries.inline) {
    if (entry) {
      entryMap.set(entry.sys.id, entry);
    }
  }

  return {
    // other options...

    renderNode: {
      // other options...
      [BLOCKS.PARAGRAPH]: (node: Node, children) => (
        <Text mb={4}>{children}</Text>
      ),
      [BLOCKS.UL_LIST]: (node, children) => (
        <UnorderedList mb={8}>{children}</UnorderedList>
      ),
      [BLOCKS.OL_LIST]: (node, children) => (
        <OrderedList mb={8}>{children}</OrderedList>
      ),
      [BLOCKS.LIST_ITEM]: (node, children) => <ListItem>{children}</ListItem>,
      [BLOCKS.TABLE]: (node, children) => (
        <TableContainer mb={8}>
          <Table size='md'>
            <Tbody>{children}</Tbody>
          </Table>
        </TableContainer>
      ),
      [BLOCKS.TABLE_ROW]: (node, children) => <Tr>{children}</Tr>,
      [BLOCKS.TABLE_HEADER_CELL]: (node, children) => (
        <Th color='inherit'>{children}</Th>
      ),
      [BLOCKS.TABLE_CELL]: (node, children) => <Td>{children}</Td>,
      [BLOCKS.QUOTE]: (node: Node, children) => (
        <Box
          borderLeft='5px solid #ccc'
          p='1em 1em 1em 1em'
          margin='0.5em 0.5em'
          mb={8}
        >
          {children}
        </Box>
      ),
      [BLOCKS.HR]: (node: Node, children) => <Divider my={8} />,
      [BLOCKS.HEADING_1]: (node: Node, children) => (
        <Heading as='h1' size='4xl' mb={16}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_2]: (node: Node, children) => (
        <Heading as='h2' size='3xl' mb={16}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_3]: (node: Node, children) => (
        <Heading as='h3' size='2xl' mb={16}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_4]: (node: Node, children) => (
        <Heading as='h4' size='xl' mb={16}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_5]: (node: Node, children) => (
        <Heading as='h5' size='lg' mb={16}>
          {children}
        </Heading>
      ),
      [BLOCKS.HEADING_6]: (node: Node, children) => (
        <Heading as='h6' size='md' mb={16}>
          {children}
        </Heading>
      ),
      [INLINES.EMBEDDED_ENTRY]: (node, children) => {
        // find the entry in the entryMap by ID
        const entry = entryMap.get(node.data.target.sys.id);
        // render the entries as needed
        if (entry.__typename === 'Publisher') {
          return (
            <Link
              as={NextLink}
              href={node.data.uri}
              _hover={{ color: 'brand-primary.200' }}
              mb={8}
            >
              {entry.title} <LinkIcon position='relative' mx='2px' />
            </Link>
          );
        }
      },
      [INLINES.HYPERLINK]: (node, children) => (
        <Link
          as={NextLink}
          href={node.data.uri}
          _hover={{ color: 'brand-primary.200' }}
          mb={8}
        >
          {children}
          <LinkIcon position='relative' mx='2px' />
        </Link>
      ),
      [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
        // find the asset in the assetMap by ID
        const asset = assetMap.get(node.data.target.sys.id);
        if (asset.contentType === 'video/mp4') {
          return (
            <iframe
              src={asset.url}
              height='300rem'
              width='100%'
              title={asset.title}
              allowFullScreen={true}
            />
          );
        }

        // render the asset accordingly
        return (
          <Image mb={8} src={asset.url} alt='My image alt text' width='200px' />
        );
      }
    }
  };
}
