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
  UnlockIcon,
} from '@chakra-ui/icons';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import InsertJob from './components/job/InsertUpdateJob';
import Register from './components/user/Register';
import Login from './components/user/Login';
import JobOffersRequests from './components/job/JobsList';
import AuthenticationService from './service/AuthenticationService';
import ViewOfferRequest from './components/job/ViewJob';
import UserService from './service/UserService';
import JobConst from './consts/JobConst';
import UserConst from './consts/UserConst';
import Footer from './components/Footer';
import Conversations from './components/message/Conversations';
import SendMessage from './components/message/SendMessage';

const mainMenu = [
  { name: 'Home', url: '/' },
  { name: 'Offers', url: '/offers' },
  { name: 'Requests', url: '/requests' },
];

const myMenu = [
  { name: 'My Offers', url: '/myOffers' },
  { name: 'My Requests', url: '/myRequests' },
];

interface UserMenuItem {
  label: string;
  href: string;
}

const RIGHT_MENU: Map<string, Array<UserMenuItem>> = new Map([
  [
    'ADMIN',
    [
      { label: 'User Offers', href: '/userOffers' },
      { label: 'User Requests', href: '/userRequests' },
    ],
  ],
  [
    'USER',
    [
      { label: 'My Offers', href: '/myOffers' },
      { label: 'My Requests', href: '/myRequests' },
      { label: 'Conversations', href: '/rooms' },
    ],
  ],
]);

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
                display={UserService.isAdmin() ? 'none' : ''}
                onClick={() => navigate('/insertJob/' + JobConst.SCOPE_PRIVATE)}
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
                    {UserService.getRole() === UserConst.ROLE_ADMIN && (
                      <Icon
                        as={UnlockIcon}
                        w={'28px'}
                        height={'28px'}
                        color={'red'}
                      />
                    )}

                    {UserService.getRole() === UserConst.ROLE_USER && (
                      <img
                        src={UserService.getUserPicture()}
                        style={{
                          borderRadius: '50%',
                          margin: 'auto',
                          width: '32px',
                          height: '32px',
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    fontSize={'0.7em'}
                    color={
                      UserService.getRole() === UserConst.ROLE_ADMIN
                        ? 'red'
                        : ''
                    }
                  >
                    {UserService.getUsername()}
                    <Icon ml={1} as={TriangleDownIcon} />
                  </Box>
                </MenuButton>
                <MenuList>
                  {RIGHT_MENU.get(UserService.getRole())?.map((menuItem) => {
                    return (
                      <MenuItem
                        key={menuItem.href}
                        onClick={() => {
                          setSelectedMenu('');
                          navigate(menuItem.href);
                        }}
                      >
                        {menuItem.label}
                      </MenuItem>
                    );
                  })}
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
                <span
                  onClick={() => navigate('/authenticate')}
                  style={{ padding: 4, cursor: 'pointer' }}
                >
                  Sign in
                </span>
                {' | '}
                <span
                  style={{ padding: 4, cursor: 'pointer' }}
                  onClick={() => navigate('/register')}
                >
                  Sign up
                </span>
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
        <Box minH={'100vh'}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/offers"
              element={
                <JobOffersRequests
                  key={'offers'}
                  type={JobConst.TYPE_OFFER}
                  scope={JobConst.SCOPE_PUBLIC}
                  title="Offers"
                />
              }
            />
            <Route
              path="/requests"
              element={
                <JobOffersRequests
                  key={'requests'}
                  type={JobConst.TYPE_REQUEST}
                  scope={JobConst.SCOPE_PUBLIC}
                  title="Requests"
                />
              }
            />
            <Route path="/insertJob/:scope" element={<InsertJob />} />
            <Route path="/editJob/:scope/:id" element={<InsertJob />} />
            <Route path="/register" element={<Register />} />
            <Route path="/rooms" element={<Conversations />} />
            <Route
              path="/room/:roomId/username/:username"
              element={<SendMessage />}
            />
            <Route path="/authenticate" element={<Login />} />
            <Route path="/view/:scope/:id" element={<ViewOfferRequest />} />
            <Route
              path="/view/:scope/:status/:id"
              element={<ViewOfferRequest />}
            />

            <Route
              path="/myOffers"
              element={
                <JobOffersRequests
                  key={'myOffers'}
                  type={JobConst.TYPE_OFFER}
                  scope={JobConst.SCOPE_PRIVATE}
                  title="My Offers"
                />
              }
            />
            <Route
              path="/myRequests"
              element={
                <JobOffersRequests
                  key={'myRequests'}
                  type={JobConst.TYPE_REQUEST}
                  scope={JobConst.SCOPE_PRIVATE}
                  title="My Requests"
                />
              }
            />

            <Route
              path="/userOffers"
              element={
                <JobOffersRequests
                  key={'userOffers'}
                  type={JobConst.TYPE_OFFER}
                  scope={JobConst.SCOPE_PRIVATE}
                  status={JobConst.STATUS_CREATED}
                  title="User Offers"
                />
              }
            />
            <Route
              path="/userRequests"
              element={
                <JobOffersRequests
                  key={'userRequests'}
                  type={JobConst.TYPE_REQUEST}
                  scope={JobConst.SCOPE_PRIVATE}
                  status={JobConst.STATUS_CREATED}
                  title="User Requests"
                />
              }
            />
          </Routes>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
