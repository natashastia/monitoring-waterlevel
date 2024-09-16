import { useState, useEffect } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Container = ({ title, children, latestDatetime }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  useEffect(() => {
    if (latestDatetime) {
      const timeAgoText = dayjs(latestDatetime).fromNow();
      setTimeAgo(timeAgoText);
    }
  }, [latestDatetime]);

  const getStatusColor = (isConnected) => {
    if (isConnected === null) return "bg-black";
    return isConnected ? "bg-red" : "bg-green";
  };

  return (
    <section className="pb-3">
      <div
        onClick={toggleExpand}
        className="flex justify-between bg-blue btn-expand p-3 text-white cursor-pointer items-center hover:bg-blue-800"
        role="button"
        aria-expanded={isExpanded}
        tabIndex="0"
      >
        <h2 className="lg:text-xl font-medium">{title}</h2>
        <div className="flex items-center mr-3">
          <span
            className={`w-2 h-2 mx-2 rounded-full ${getStatusColor()}`}
            aria-label="Status indicator"
          ></span>
          <time
            dateTime={latestDatetime}
            className="italic lg:text-base text-xs"
          >
            {timeAgo}
          </time>
        </div>
      </div>
      <div
        className={`bg-gray px-2 text-black transition-max-height duration-500 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[650px]" : "max-h-0"
        }`}
        aria-hidden={!isExpanded}
      >
        {children}
      </div>
    </section>
  );
};

export default Container;
