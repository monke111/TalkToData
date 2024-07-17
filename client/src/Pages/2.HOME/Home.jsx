import React, { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Icon,
  VStack,
  Container,
  Input,
  FormControl,
  FormLabel,
  Text,
  Flex,
  Stack,
  Grid,
  Divider,
} from '@chakra-ui/react';
import { FaDatabase } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';
import axios from 'axios';

const Message = ({ text, actor }) => (
  <Flex
    p={4}
    bg={actor === 'user' ? 'blue.500' : 'gray.700'} // Darker background for bot
    color={actor === 'user' ? 'white' : 'white'}
    borderRadius="lg"
    w="fit-content"
    alignSelf={actor === 'user' ? 'flex-end' : 'flex-start'}
  >
    <Text>{text}</Text>
  </Flex>
);

const Home = () => {
  const [selectedButton, setSelectedButton] = useState(null);
  const [mysqlInputs, setMysqlInputs] = useState({
    MYSQL_HOST: '',
    MYSQL_USER: '',
    MYSQL_PASSWORD: '',
    MYSQL_DATABASE: '',
    MYSQL_PORT: '',
  });
  const [mongoConnection, setMongoConnection] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedConnection, setSubmittedConnection] = useState('');
  const [messages, setMessages] = useState([]);

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  };

  const handleMysqlInputChange = (e) => {
    const { name, value } = e.target;
    setMysqlInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (type) => {
    try {
      if (type === 'SQL') {
        const connectionString = Object.entries(mysqlInputs)
          .map(([key, value]) => `${key}=${value}`)
          .join('; ');
        setSubmittedConnection(`MySQL Connection: ${connectionString}`);

        const response = await axios.post('http://localhost:5000/api/sql-connection', mysqlInputs);
        const botMessage = response.data.message;

        setMessages([...messages, { text: botMessage, actor: 'bot' }]);
      } else {
        setSubmittedConnection(`MongoDB Connection: ${mongoConnection}`);
        await axios.post('http://localhost:5000/api/mongo-connection', { connectionString: mongoConnection });
      }
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting connection:', error);
    }
  };

  const handleUserMessage = async (text) => {
    setMessages([...messages, { text, actor: 'user' }]);
    const botResponse = `You said: ${text}`;
    setMessages((prev) => [...prev, { text: botResponse, actor: 'bot' }]);
  };

  if (isSubmitted) {
    return (
      <Container maxW="container.xl" centerContent>
        <VStack width="full" alignItems="center" spacing={8} pt={8}>
          <Box
            width="700px" borderWidth={1} borderRadius="lg" p={4} boxShadow="md"
          >
            <VStack spacing={2} width="full" alignItems="flex-start">
              <Text fontWeight="bold" fontSize="lg">
                Submitted Connection
              </Text>
              <Divider />
              <Text fontWeight="bold">Connection Details:</Text>
              <Text>{submittedConnection}</Text>
            </VStack>
          </Box>

          <Box width="700px" borderWidth={1} borderRadius="lg" p={4} boxShadow="md">
            <Stack spacing={4} overflowY="auto" maxH="300px">
              {messages.map((msg, index) => (
                <Message key={index} text={msg.text} actor={msg.actor} />
              ))}
            </Stack>
            <HStack mt={4}>
              <Input
                bg="transparent"
                placeholder="Enter your text"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUserMessage(e.target.value);
                    e.target.value = '';
                  }
                }}
              />
              <Button colorScheme="blue" onClick={() => handleUserMessage(document.getElementById('messageInput').value)}>
                Send
              </Button>
            </HStack>
          </Box>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" centerContent>
      <VStack width="full" alignItems="center" spacing={8} pt={8}>
        <Box
          borderWidth={1}
          borderColor="gray.300"
          borderRadius="lg"
          p={6}
          boxShadow="md"
          bg="transparent"
          width="700px"
        >
          <VStack spacing={4} width="full">
            <HStack spacing={4} justifyContent="center" width="full">
              <Button
                leftIcon={<Icon as={FaDatabase} />}
                onClick={() => handleButtonClick('SQL')}
                colorScheme={selectedButton === 'SQL' ? 'blue' : 'gray'}
              >
                SQL
              </Button>
              <Button
                leftIcon={<Icon as={SiMongodb} />}
                onClick={() => handleButtonClick('MongoDB')}
                colorScheme={selectedButton === 'MongoDB' ? 'blue' : 'gray'}
              >
                MongoDB
              </Button>
            </HStack>

            {selectedButton === 'SQL' && (
              <FormControl>
                <FormLabel>MySQL Connection Details</FormLabel>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {Object.keys(mysqlInputs).map((key) => (
                    <Input
                      key={key}
                      name={key}
                      placeholder={key}
                      value={mysqlInputs[key]}
                      onChange={handleMysqlInputChange}
                    />
                  ))}
                </Grid>
                <Button mt={4} colorScheme="blue" onClick={() => handleSubmit('SQL')}>
                  Submit MySQL Connection
                </Button>
              </FormControl>
            )}

            {selectedButton === 'MongoDB' && (
              <FormControl>
                <FormLabel>MongoDB Connection String</FormLabel>
                <Input
                  placeholder="Enter MongoDB connection string"
                  value={mongoConnection}
                  onChange={(e) => setMongoConnection(e.target.value)}
                />
                <Button mt={2} colorScheme="green" onClick={() => handleSubmit('MongoDB')}>
                  Submit MongoDB Connection
                </Button>
              </FormControl>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default Home;
