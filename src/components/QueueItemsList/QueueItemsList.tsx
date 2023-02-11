import QueueItem from "../QueueItem/QueueItem";
import style from "./QueueItemsList.module.css";

interface IQueueItemsList {
  list: Record<string, Queue<User>>;
}

const QueueItemsList = ({ list }: IQueueItemsList) => {
  return (
    <div className={style.wrapper}>
      {Object.values(list).map((queue) => (
        <QueueItem key={queue.id} {...queue} />
      ))}
    </div>
  );
};

export default QueueItemsList;
