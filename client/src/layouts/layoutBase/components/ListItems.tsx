import AssignmentIcon from "@mui/icons-material/Assignment";
import AutoStoriesSharpIcon from "@mui/icons-material/AutoStoriesSharp";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import {
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

export const MainList = () => {
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
      <Link to="/music">
        <CustomInfo title="Room" icon={<LibraryMusicIcon />} />
      </Link>
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
