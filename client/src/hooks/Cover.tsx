import { useEffect, useState } from "react";
import CoverAPI from "~/apis/CoverAPI";
import { CoverInfo } from "~/types/mongo/cover";
import { RelationshipMongo } from "~/types/mongo/mongoDB";

export function useCoverMongo(relationships?: RelationshipMongo[]) {
  if (!relationships) return undefined;
  const [state, setState] = useState<CoverInfo>();

  useEffect(() => {
    init();
  }, [relationships]);

  async function init() {
    if (!relationships) return;
    const cover = relationships.find((item) => item.type == "cover");
    if (!cover) return;

    const res = await CoverAPI.getCover(cover.id);
    setState(() => res.data);
  }

  return state;
}
