import { WS_BASE } from "../api/config"; // adjust path as needed

export function connectUserStream(onMessage, onMarginAlert) {
    const access = localStorage.getItem("access");
    if (!access) throw new Error("Missing access token");

    const wsUrl = `${WS_BASE}/ws/user/stream/?token=${encodeURIComponent(access)}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === "margin_alert") {
          // call margin alert callback handler if provided
          onMarginAlert?.(msg.data);
          return;
        }
        onMessage?.(msg);
      } catch (err) {
        console.error("WebSocket message error", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return ws;
}
