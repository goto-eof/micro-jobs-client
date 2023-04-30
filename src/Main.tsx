import { useState } from 'react';
import {
  Box,
  Flex,
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
  Icon,
} from '@chakra-ui/react';
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  TriangleDownIcon,
} from '@chakra-ui/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import InsertJob from './components/job/InsertUpdateJob';
import Register from './components/user/Register';
import Login from './components/user/Login';
import JobOffersRequests from './components/job/JobOffersRequests';
import AuthenticationService from './service/AuthenticationService';
import ViewOfferRequest from './components/job/ViewOfferRequest';
import UserService from './service/UserService';

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
                  alignContent={'center'}
                >
                  <Box>
                    <img
                      src={UserService.getUserPicture()}
                      style={{
                        borderRadius: '50%',
                        margin: 'auto',
                        width: '32px',
                        height: '32px',
                      }}
                    />
                  </Box>
                  <Box fontSize={'0.7em'}>
                    {UserService.getUsername()}
                    <Icon ml={1} as={TriangleDownIcon} />
                  </Box>
                </MenuButton>
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setSelectedMenu('');
                      navigate('/myOffers');
                    }}
                  >
                    My Offers
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setSelectedMenu('');
                      navigate('/myRequests');
                    }}
                  >
                    My Requests
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    onClick={() =>
                      AuthenticationService.logout(() => navigate('/offers'))
                    }
                  >
                    Logout
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

      <Box px={0}>
        <Box>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/offers"
              element={
                <JobOffersRequests
                  key={'offers'}
                  baseUrl="api/v1/job/public/0"
                  urlCountItems="api/v1/job/public/count/0"
                  title="Offers"
                />
              }
            />
            <Route
              path="/requests"
              element={
                <JobOffersRequests
                  key={'requests'}
                  baseUrl="api/v1/job/public/1"
                  urlCountItems="api/v1/job/public/count/1"
                  title="Requests"
                />
              }
            />
            <Route path="/insertJob" element={<InsertJob />} />
            <Route path="/editJob/:id" element={<InsertJob />} />
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
                  title="My Offers"
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
                  title="My Requests"
                />
              }
            />
          </Routes>
        </Box>
      </Box>
    </>
  );
}
