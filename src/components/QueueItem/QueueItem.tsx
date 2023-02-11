import style from "./QueueItem.module.css";

const QueueItem = ({ id, state, resolvedItems }: Queue<User>) => {
  return (
    <div key={id} className={style.wrapper}>
      <div className={style.header}>
        <h2 className="font-bold text-lg">Queue</h2>
        <p>
          Id: <span className="font-bold">{id}</span>
        </p>
        <p>
          Resolved items:{" "}
          <span className="font-bold">{resolvedItems.length}</span>
        </p>
        <p>
          Status: <span className="font-bold">{state}</span>
        </p>
      </div>

      <div className={style.resolvedItemsList}>
        {resolvedItems.map(({ id, name, email }) => (
          <div key={id} className={style.resolvedItem}>
            <span className="font-bold text-xs text-gray-400">{id}</span>
            <span className="font-bold">{name}</span>
            <span className="font-light">{email}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QueueItem;
