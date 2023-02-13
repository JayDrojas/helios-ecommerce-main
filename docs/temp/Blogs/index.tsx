import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text
} from '@chakra-ui/react';

interface InterfaceBlog {
  blogsArr: {
    image: string;
    title: string;
    desc: string;
  }[];
}

const blog: InterfaceBlog = {
  blogsArr: [
    {
      image: 'cat-image1.jpeg',
      title: 'This is a test',
      desc: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. '
    },
    {
      image: 'cat-image1.jpeg',
      title: 'This is a test',
      desc: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. '
    }
  ]
};

const Blogs = () => {
  return (
    <Box h='44rem' w='100%'>
      <Box
        w='80%'
        m='auto'
        py='10'
        justifyContent='space-between'
        color='white'
      >
        <Container color='black'>
          <Heading
            m='auto'
            fontSize='2xl'
            w='20rem'
            fontWeight='medium'
            textAlign='center'
          >
            You may be wondering why shoes and headphones?
          </Heading>
        </Container>
      </Box>
      <Flex m='auto' w='80%' justifyContent='center' gap='7'>
        {blog.blogsArr.map((item) => (
          <Box key={item.image}>
            <Image src={`images/${item.image}`} alt='/' />
            <Heading mt='4' size='md'>
              {item.title}
            </Heading>
            <Text mb={4} mt={2} fontSize='sm'>
              {item.desc}
            </Text>
            <Button colorScheme='brand-primary'>View</Button>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Blogs;
