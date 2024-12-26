import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  BoxProps,
  FlexProps,
  DrawerOverlay
} from "@chakra-ui/react";
import {
  FiTrendingUp,
  FiCompass,
  FiMenu,
} from "react-icons/fi";
import {FaSun} from "react-icons/fa";
import {MdOutlineNightlight} from "react-icons/md";
import {IconType} from "react-icons";
import React from "react";
import {Link as NextLink, useLocation} from "react-router-dom";
import {ThemeProvider, useTheme} from 'next-themes';

interface LinkItemProps {
  name: string;
  icon: IconType;
  link: string;
}

interface MenuProps {
  header: string;
  submenu: Array<LinkItemProps>;
}

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: React.ReactNode;
  href: string;
}

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const LinkItems: Array<MenuProps> = [
  {
    header: "Models",
    submenu: [
      // { name: "Vision", icon: FiTrendingUp, link: "/vision" },
      {name: "Toxic", icon: FiCompass, link: "/hate"},
      {name: "Intent Classification", icon: FiCompass, link: "/classify-intent"},
    ],
  },
  // {
  //   header: "Docs",
  //   submenu: [{ name: "Docs", icon: FiCompass, link: "/docs" }],
  // },
];

const SidebarContent = ({onClose, ...rest}: SidebarProps) => {
  const {theme} = useTheme();

  // Replace useColorModeValue logic with custom values based on the theme
  const bgColor = theme === "dark" ? "gray.900" : "white";
  const textColor = theme === "dark" ? "white" : "black";

  return (
    <Box
      bg={bgColor}
      w={{base: "full", md: 60}}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Box h="20">
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" as={NextLink} to="/">
            Model Demo
          </Text>
          <CloseButton display={{base: "flex", md: "none"}} onClick={onClose}/>
        </Flex>
      </Box>
      {LinkItems.map((menu, idx) => (
        <Flex
          key={"menu: " + idx.toString()}
          justifyContent="start"
          mx="8"
          mb="2"
          flexDirection="column"
        >
          <Text fontSize="lg" fontWeight="bold" mb="2" color={textColor}>
            {menu.header}
          </Text>
          {menu.submenu.map((link) => (
            <NavItem key={link.name} icon={link.icon} href={link.link}>
              {link.name}
            </NavItem>
          ))}
        </Flex>
      ))}
    </Box>
  );
};

const NavItem = ({ icon, href, children, ...rest }: NavItemProps) => {
  const { theme } = useTheme();
  const location = useLocation();
  const pathname = location.pathname;

  // Replace useColorModeValue with custom logic
  const bgColor = theme === "dark" ? "#fb2f4ecf" : "#fb2f4ecf"; // Same for both themes in this case
  const textColor = "white";

  return (
    <Box
      as="a"
      href={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      justifyContent="flex-start"
    >
      <Flex
        align="center"
        p="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        backgroundColor={pathname === href ? bgColor : ""}
        color={pathname === href ? textColor : ""}
        _hover={{
          bg: bgColor,
          color: textColor,
          cursor: "pointer",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        <Text fontWeight={pathname === href ? 600 : 400}>{children}</Text>
      </Flex>
    </Box>
  );
};

const MobileNav = ({onOpen, ...rest}: MobileProps) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const bgColor = theme === "dark" ? "gray.900" : "white";

  return (
    <Flex
      ml={{base: 0, md: 60}}
      px={{base: 4, md: 4}}
      height="20"
      alignItems="center"
      bg={bgColor}
      justifyContent={{base: "space-between", md: "flex-end"}}
      {...rest}
    >
      <IconButton
        display={{base: "flex", md: "none"}}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu/>}
      />

      <Box h="20" display={{base: "flex", md: "none"}}>
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text
            fontSize="2xl"
            fontFamily="monospace"
            fontWeight="bold"
            as={NextLink}
            to="/"
          >
            Model Demo
          </Text>
        </Flex>
      </Box>

      <HStack spacing={{base: "0", md: "6"}}>
        <Flex alignItems={"center"}>
          <IconButton
            size="lg"
            variant="ghost"
            icon={
              theme === "light" ? (
                <MdOutlineNightlight fontSize="20px"/>
              ) : (
                <FaSun fontSize="20px"/>
              )
            }
            aria-label="Switch theme"
            onClick={toggleTheme}
          />
        </Flex>
      </HStack>
    </Flex>
  );
};

type Props = {
  children?: React.ReactNode;
};

const SidebarWithHeader: React.FC<Props> = ({ children }) => {
  const { open, onOpen, onClose } = useDisclosure();
  const { theme } = useTheme();

  // Replace useColorModeValue logic
  const bgColor = theme === "dark" ? "gray.900" : "gray.100";

  return (
    <Box minH="100vh" bg={bgColor}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={open}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* Mobile navigation */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
};

export default SidebarWithHeader;
