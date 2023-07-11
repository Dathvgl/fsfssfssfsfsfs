import { toast } from "react-toastify";
import ZingMP3API from "~/apis/ZingMP3API";
import { init, played } from "~/redux/slices/player";
import { store } from "~/redux/store";

export async function ZingMP3Src(id: string) {
  await ZingMP3API.song(id).then(({ data }) => {
    if (data.err != 0) toast.error(data.msg);
    else {
      const { "128": src } = data.data;
      store.dispatch(init({ id, src }));
      store.dispatch(played({ played: false }));
    }
  });
}
