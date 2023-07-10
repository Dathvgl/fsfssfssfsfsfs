import {
  RootRoute,
  Route,
  Router,
  RouterProvider,
  useNavigate,
} from "@tanstack/router";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import UserAPI from "~/apis/UserAPI";
import { LayoutAuth, LayoutAuthMusicSpotify } from "~/layouts/LayoutAuth";
import LayoutBase from "~/layouts/layoutBase/LayoutBase";
import { empty } from "~/redux/slices/user";
import { useAppDispatch, useAppSelector } from "~/redux/store";
import { customLazy } from "~/utils/CustomLazy";
import { httpClientPrivate } from "~/utils/HttpClient";

const HomeRoute = customLazy(() => import("~/routes/home/Home"));
const ErrorRoute = customLazy(() => import("~/routes/Error"));
const UserProfileRoute = customLazy(
  () => import("~/routes/user/routes/Profile")
);
const UserMangaFollowRoute = customLazy(
  () => import("~/routes/user/routes/MangaFollow")
);
const TodoRoute = customLazy(() => import("~/routes/todo/Todo"));
const MangaRoute = customLazy(() => import("~/routes/manga/Manga"));
const MangaDetail = customLazy(
  () => import("~/routes/manga/routes/detail/Detail")
);
const MangaChapter = customLazy(() => import("~/routes/manga/routes/Chapter"));
const RoomRoute = customLazy(() => import("~/routes/room/Room"));
const RoomDetail = customLazy(() => import("~/routes/room/routes/Detail"));
const MusicZingMP3 = customLazy(() => import("~/routes/music/zingMP3/ZingMP3"));

function RootApp() {
  const navigate = useNavigate();

  const { isUser } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isUser) init();
  }, []);

  async function init() {
    try {
      const { data } = await UserAPI.refresh();
      httpClientPrivate.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.token}`;
      toast.info("Refresh token");
    } catch (error) {
      const { response } = error as AxiosError;
      toast.error(response?.data as string);
      dispatch(empty());
      navigate({ to: "/" });
    }
  }

  return (
    <>
      <LayoutBase />
      <ToastContainer
        position="bottom-left"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

const rootRoute = new RootRoute({ component: RootApp });

const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeRoute,
});

const errorRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/*",
  component: ErrorRoute,
});

const userRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/user",
});

const userProfileRoute = new Route({
  getParentRoute: () => userRoute,
  path: "/profile",
  component: UserProfileRoute,
});

const userMangaFollowRoute = new Route({
  getParentRoute: () => userRoute,
  path: "/mangaFollow",
  component: () => (
    <LayoutAuth>
      <UserMangaFollowRoute />
    </LayoutAuth>
  ),
});

const todoRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/todo",
  component: () => (
    <LayoutAuth>
      <TodoRoute />
    </LayoutAuth>
  ),
});

const mangaRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/manga",
});

const mangaIndexRoute = new Route({
  getParentRoute: () => mangaRoute,
  path: "/",
  component: MangaRoute,
});

const mangaDetailRoute = new Route({
  getParentRoute: () => mangaRoute,
  path: "$path",
  component: MangaDetail,
});

const mangaChapterRoute = new Route({
  getParentRoute: () => mangaRoute,
  path: "/chapter/$path",
  component: MangaChapter,
});

const roomRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/room",
});

const roomIndexRoute = new Route({
  getParentRoute: () => roomRoute,
  path: "/",
  component: RoomRoute,
});

const roomDetailRoute = new Route({
  getParentRoute: () => roomRoute,
  path: "$id",
  component: () => (
    <LayoutAuth>
      <RoomDetail />
    </LayoutAuth>
  ),
});

const musicRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/music",
});

const musicSpotifyRoute = new Route({
  getParentRoute: () => musicRoute,
  path: "/spotify",
  component: () => <LayoutAuthMusicSpotify />,
});

const musicZingMP3Route = new Route({
  getParentRoute: () => musicRoute,
  path: "/zingMP3",
  component: MusicZingMP3,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  errorRoute,
  userRoute.addChildren([userProfileRoute, userMangaFollowRoute]),
  todoRoute,
  mangaRoute.addChildren([
    mangaIndexRoute,
    mangaDetailRoute,
    mangaChapterRoute,
  ]),
  roomRoute.addChildren([roomIndexRoute, roomDetailRoute]),
  musicRoute.addChildren([musicSpotifyRoute, musicZingMP3Route]),
]);

const router = new Router({ routeTree });

declare module "@tanstack/router" {
  interface Register {
    router: typeof router;
  }
}

function AppRoute() {
  return <RouterProvider router={router} />;
}

export default AppRoute;
