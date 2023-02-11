import React, { useEffect, useState } from "react";
import ResolvedItem from "../ResolvedItem/ResolvedItem";
import style from "./ResolvedItemsList.module.css";

interface IResolvedItemsListProps {
  list: Array<ResolvedItem<User>>;
  maxItems: number;
}

const ResolvedItemsList = ({ list, maxItems }: IResolvedItemsListProps) => {
  const [time, setTime] = useState<number | string>(Date.now());

  useEffect(() => {
    if (list.length === maxItems) {
      setTime((prevValue) =>
        ((Date.now() - Number(prevValue)) / 1000).toFixed(2)
      );
      return;
    }
  }, [list]);

  return (
    <div className={style.wrapper}>
      <div className={style.header}>
        Resolved items {list.length} / {maxItems}
      </div>
      <div className={style.listWrapper}>
        {list.map((resolvedItem) => (
          <ResolvedItem key={resolvedItem.id} {...resolvedItem} />
        ))}
      </div>
      {list.length > 0 && list.length === maxItems && (
        <div className={style.summary}>
          Fetching ended in: <strong>{time} s</strong>
        </div>
      )}
    </div>
  );
};

export default ResolvedItemsList;
