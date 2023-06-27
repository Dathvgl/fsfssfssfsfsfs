import { Backdrop, Box, Fab, Fade, Modal, SxProps, Theme } from "@mui/material";
import { ReactNode, useState } from "react";

const style: SxProps<Theme> | undefined = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

type CustomModalFloatProps = {
  icon?: ReactNode;
  children?: ReactNode;
};

function CustomModalFloat(props: CustomModalFloatProps) {
  const { icon, children } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div className="fixed right-8 bottom-8">
        <Fab color="primary" onClick={handleOpen}>
          {icon}
        </Fab>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}
      >
        <Fade in={open}>
          <Box sx={style}>{children}</Box>
        </Fade>
      </Modal>
    </>
  );
}

export default CustomModalFloat;
