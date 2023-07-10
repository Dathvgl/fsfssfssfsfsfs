import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesSharpIcon from "@mui/icons-material/AutoStoriesSharp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link } from "@tanstack/router";
import { ReactNode } from "react";

function CustomInfo(props: { title: string; icon: ReactNode }) {
  const { title, icon } = props;

  return (
    <>
      <ListItemButton>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </>
  );
}

function CustomInfoBase(props: { title: string; icon: ReactNode }) {
  const { title, icon } = props;

  return (
    <>
      <ButtonBase sx={{ pl: "16px", py: "8px" }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ButtonBase>
    </>
  );
}

export const MainList = (props: { open: boolean }) => {
  const { open } = props;

  return (
    <>
      <Link to="/">
        <CustomInfo title="Home" icon={<DashboardIcon />} />
      </Link>
      <Link to="/todo">
        <CustomInfo title="Todo" icon={<PlaylistAddCheckIcon />} />
      </Link>
      <Link to="/manga">
        <CustomInfo title="Manga" icon={<AutoStoriesSharpIcon />} />
      </Link>
      <Link to="/room">
        <CustomInfo title="Room" icon={<MeetingRoomIcon />} />
      </Link>
      <Accordion className="m-0" disableGutters expanded={open}>
        <AccordionSummary
          className="accordion-summary"
          expandIcon={<ExpandMoreIcon />}
        >
          <CustomInfoBase title="Music" icon={<LibraryMusicIcon />} />
        </AccordionSummary>
        <Link to="/music/spotify">
          <AccordionDetails>Spotify</AccordionDetails>
        </Link>
        <Link to="/music/zingMP3">
          <AccordionDetails>Zing MP3</AccordionDetails>
        </Link>
      </Accordion>
    </>
  );
};

export const SecondList = (
  <>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </>
);
