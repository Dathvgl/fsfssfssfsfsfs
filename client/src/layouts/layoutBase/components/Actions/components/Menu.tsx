import { Menu, PopoverVirtualElement } from "@mui/material";
import { ReactNode } from "react";

type ActionsMenuProps = {
  children?: ReactNode;
  anchorEl?:
    | Element
    | (() => Element)
    | PopoverVirtualElement
    | (() => PopoverVirtualElement)
    | null
    | undefined;
  id?: string | undefined;
  open: boolean;
  onClose?:
    | ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
    | undefined;
};

function ActionsMenu(props: ActionsMenuProps) {
  const { children, anchorEl, id, open, onClose } = props;

  return (
    <Menu
      sx={{ marginTop: "3rem" }}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={id}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={open}
      onClose={onClose}
    >
      {children}
    </Menu>
  );
}

export default ActionsMenu;
