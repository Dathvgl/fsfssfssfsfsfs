import { AccountCircle } from "@mui/icons-material";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import MoreIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem
} from "@mui/material";
import { useNavigate } from "@tanstack/router";
import { useEffect, useRef, useState } from "react";
import { logout } from "~/redux/slices/user";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import UserInit from "~/routes/user/init/Init";
import ActionsAvatar from "./components/Avatar";
import ActionsBadge from "./components/Badge";
import ActionsMenu from "./components/Menu";

function LayoutBaseActions() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isUser } = useAppSelector((state) => state.user);

  const drawerRef = useRef<HTMLDivElement>(null);

  const [drawer, setDrawer] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement>();
  const [mobileAnchorEl, setMobileAnchorEl] = useState<HTMLElement>();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileAnchorEl);

  useEffect(() => {
    if (isUser) {
      handleMenuClose();
      setDrawer(() => false);
    }
  }, [isUser]);

  function toggleDrawer(check: boolean) {
    return (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      )
        return;
      setDrawer(() => check);
    };
  }

  function handleMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileAnchorEl(undefined);
  }

  function handleMenuClose() {
    setAnchorEl(undefined);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event: React.MouseEvent<HTMLElement>) {
    setMobileAnchorEl(event.currentTarget);
  }

  const navProfile = () => navigate({ to: "/user/profile" });
  const navMangaFollow = () => navigate({ to: "/user/mangaFollow" });

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <ActionsMenu
      anchorEl={anchorEl}
      id={menuId}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={async () => {
          handleMenuClose();
          await navProfile();
        }}
      >
        Profile
      </MenuItem>
      <MenuItem
        onClick={async () => {
          handleMenuClose();
          await navMangaFollow();
        }}
      >
        Manga Follow
      </MenuItem>
      <MenuItem onClick={() => dispatch(logout({})).then(handleMenuClose)}>
        Logout
      </MenuItem>
    </ActionsMenu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <ActionsMenu
      anchorEl={mobileAnchorEl}
      id={mobileMenuId}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <ActionsBadge total={4} size="large" />
        <p>Notifications</p>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          handleMenuClose();
          await navProfile();
        }}
      >
        <IconButton size="large" color="inherit" aria-haspopup="true">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
      <MenuItem
        onClick={async () => {
          handleMenuClose();
          await navMangaFollow();
        }}
      >
        <IconButton size="large" color="inherit" aria-haspopup="true">
          <LibraryBooksIcon />
        </IconButton>
        <p>Manga Follow</p>
      </MenuItem>
    </ActionsMenu>
  );

  return (
    <>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <ActionsBadge total={4} />
        {isUser ? (
          <IconButton
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleMenuOpen}
          >
            <ActionsAvatar />
          </IconButton>
        ) : (
          <Button
            size="large"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={toggleDrawer(true)}
            color="inherit"
          >
            <AccountCircle />
          </Button>
        )}
      </Box>
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          color="inherit"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={(event) => {
            console.log("Drawer", drawer);
            if (!drawer) setDrawer(() => true);
            else handleMobileMenuOpen(event);
          }}
        >
          <MoreIcon />
        </IconButton>
      </Box>
      {isUser && <>{renderMenu}</>}
      {isUser && <>{renderMobileMenu}</>}
      <Drawer anchor="right" open={drawer} onClose={toggleDrawer(false)}>
        <Box className="max-[600px]:w-screen" role="presentation">
          <div ref={drawerRef}>
            <UserInit drawerFn={() => setDrawer(() => false)} />
          </div>
        </Box>
      </Drawer>
    </>
  );
}

export default LayoutBaseActions;
