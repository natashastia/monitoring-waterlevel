import Pusher from "pusher-js";

const key = import.meta.env.VITE_REACT_APP_KEY;

export const initializePusher = () => {
  return new Pusher(key, {
    cluster: "ap1",
    encrypted: true,
  });
};

export const subscribeToChannel = (pusher, setRealtimeData) => {
  const channel = pusher.subscribe("device.LevelTransducer_TestingUGM");

  channel.bind("App\\Events\\UplinkReceived", (message) => {
    setRealtimeData(message.payload);
  });

  return channel;
};
