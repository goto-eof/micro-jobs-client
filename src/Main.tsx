import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import InsertJob from './components/InsertJob';
import Register from './components/Register';
import Login from './components/Login';
import OffersRequests from './components/OffersRequests';
import AuthenticationService from './service/AuthenticationService';

const mainMenu = [
  { name: 'Home', url: '/' },
  { name: 'Offers', url: '/offers' },
  { name: 'Requests', url: '/requests' },
];

const myMenu = [
  { name: 'My Offers', url: '/myOffers' },
  { name: 'My Requests', url: '/myRequests' },
];

export default function Main() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAuthenticated = () => {
    return localStorage.getItem('access_token');
  };
  let navigate = useNavigate();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Box fontWeight={'extrabold'}>MicroJobs</Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {mainMenu.map((link) => (
                <Box onClick={() => navigate(link.url)} key={link.name}>
                  {link.name}
                </Box>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <HStack display={{ base: 'none', md: 'flex' }}>
              {isAuthenticated() &&
                myMenu.map((link) => (
                  <Box
                    pr={4}
                    onClick={() => navigate(link.url)}
                    key={link.name}
                  >
                    {link.name}
                  </Box>
                ))}
            </HStack>
            {isAuthenticated() && (
              <Button
                variant={'solid'}
                colorScheme={'teal'}
                size={'sm'}
                mr={4}
                leftIcon={<AddIcon />}
                onClick={() => navigate('/insertJob')}
              >
                Add Job
              </Button>
            )}
            {isAuthenticated() && (
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                >
                  <Avatar
                    size={'sm'}
                    src={
                      'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                    }
                  />
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() =>
                      AuthenticationService.logout(() => navigate('/offers'))
                    }
                  >
                    Logout
                  </MenuItem>
                  <MenuItem>Link 2</MenuItem>
                  <MenuDivider />
                  <MenuItem>Link 3</MenuItem>
                </MenuList>
              </Menu>
            )}
            {!isAuthenticated() && (
              <>
                <span onClick={() => navigate('/authenticate')}>Login</span>
                {' | '}
                <span onClick={() => navigate('/register')}>Register</span>
              </>
            )}
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {mainMenu.map((link) => (
                <Box onClick={() => navigate(link.url)} key={link.name}>
                  {link.name}
                </Box>
              ))}
              {isAuthenticated() &&
                myMenu.map((link) => (
                  <Box
                    pr={4}
                    onClick={() => navigate(link.url)}
                    key={link.name}
                  >
                    {link.name}
                  </Box>
                ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Box p={4}>
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/offers"
              element={
                <OffersRequests
                  key={'offers'}
                  baseUrl="api/v1/job/offers"
                  urlCountItems="api/v1/job/count/offers"
                />
              }
            />
            <Route
              path="/requests"
              element={
                <OffersRequests
                  key={'requests'}
                  baseUrl="api/v1/job/requests"
                  urlCountItems="api/v1/job/count/requests"
                />
              }
            />
            <Route path="/insertJob" element={<InsertJob />} />
            <Route path="/register" element={<Register />} />
            <Route path="/authenticate" element={<Login />} />

            <Route
              path="/myOffers"
              element={
                <OffersRequests
                  key={'myOffers'}
                  baseUrl="api/v1/job/myOffers"
                  urlCountItems="api/v1/job/count/myOffers"
                />
              }
            />
            <Route
              path="/myRequests"
              element={
                <OffersRequests
                  key={'myRequests'}
                  baseUrl="api/v1/job/myRequests"
                  urlCountItems="api/v1/job/count/myRequests"
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </>
  );
}
