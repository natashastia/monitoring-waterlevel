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

  channel.bind("pusher:subscription_succeeded", () => {
    console.log("Successfully subscribed to the channel.");
  });

  channel.bind("pusher:subscription_error", (status) => {
    console.error("Failed to subscribe to the channel. Status:", status);
  });

  channel.bind("App\\Events\\UplinkReceived", (message) => {
    setRealtimeData(message.payload);
  });

  return channel;
};
