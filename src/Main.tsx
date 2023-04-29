import { ReactNode, useState } from 'react';
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
  useStatStyles,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  ViewOffIcon,
} from '@chakra-ui/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import InsertJob from './components/InsertJob';
import Register from './components/Register';
import Login from './components/Login';
import JobOffersRequests from './components/JobOffersRequests';
import AuthenticationService from './service/AuthenticationService';
import ViewOfferRequest from './components/ViewOfferRequest';

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
  const [selectedMenu, setSelectedMenu] = useState('/');
  const isAuthenticated = () => {
    return localStorage.getItem('access_token');
  };
  let navigate = useNavigate();
  const selectMenuAndNavigate = (link: { name: string; url: string }): void => {
    setSelectedMenu(link.url);
    navigate(link.url);
  };

  return (
    <>
      <Box bg={useColorModeValue('white', 'white')} px={4} boxShadow={'base'}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack
            spacing={8}
            alignItems={'center'}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            <Box
              fontWeight={'extrabold'}
              color={'green.400'}
              textShadow={'xl'}
              fontSize={32}
            >
              MicroJobs
            </Box>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}
            >
              {mainMenu.map((link) => (
                <Box
                  fontWeight={'bold'}
                  borderBottomWidth={selectedMenu === link.url ? '5px' : '0'}
                  borderBottomColor={'green.300'}
                  pb={2}
                  onClick={() => selectMenuAndNavigate(link)}
                  key={link.name}
                >
                  {link.name}
                </Box>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {isAuthenticated() && (
              <Button
                variant={'solid'}
                colorScheme={'green'}
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
                  <MenuDivider />
                  <MenuItem onClick={() => navigate('/myOffers')}>
                    My Offers
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/myRequests')}>
                    My Requests
                  </MenuItem>
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
            <Stack as={'nav'} spacing={4} textAlign={'center'}>
              {mainMenu.map((link) => (
                <Box
                  onClick={() => selectMenuAndNavigate(link)}
                  borderBottomWidth={selectedMenu === link.url ? '3px' : '0'}
                  borderBottomColor={'green.300'}
                  key={link.name}
                >
                  {link.name}
                </Box>
              ))}
              {isAuthenticated() &&
                myMenu.map((link) => (
                  <Box
                    pr={4}
                    borderBottomWidth={selectedMenu === link.url ? '3px' : '0'}
                    borderBottomColor={'green.300'}
                    onClick={() => selectMenuAndNavigate(link)}
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
                <JobOffersRequests
                  key={'offers'}
                  baseUrl="api/v1/job/0"
                  urlCountItems="api/v1/job/count/0"
                />
              }
            />
            <Route
              path="/requests"
              element={
                <JobOffersRequests
                  key={'requests'}
                  baseUrl="api/v1/job/1"
                  urlCountItems="api/v1/job/count/1"
                />
              }
            />
            <Route path="/insertJob" element={<InsertJob />} />
            <Route path="/register" element={<Register />} />
            <Route path="/authenticate" element={<Login />} />
            <Route path="/view/:id" element={<ViewOfferRequest />} />

            <Route
              path="/myOffers"
              element={
                <JobOffersRequests
                  key={'myOffers'}
                  baseUrl="api/v1/job/mine/0"
                  urlCountItems="api/v1/job/count/mine/0"
                />
              }
            />
            <Route
              path="/myRequests"
              element={
                <JobOffersRequests
                  key={'myRequests'}
                  baseUrl="api/v1/job/mine/1"
                  urlCountItems="api/v1/job/count/mine/1"
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </>
  );
}
