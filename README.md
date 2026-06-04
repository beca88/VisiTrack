# VisiTrack – Visitor Tracking System

VisiTrack is a full-stack, real-time Internet of Things (IoT) solution designed to monitor physical spaces by tracking and logging foot traffic instantaneously. Built as an end-to-end telemetry pipeline, the system bridges edge hardware with a modern web ecosystem to visualize visitor data with zero perceived latency.


---

## 🛠️ System Architecture

VisiTrack leverages a decoupled, three-tier architecture to maintain ultra-low latency data transmission from the physical sensor up to the browser interface:

1. **The Sensing Layer (Edge):** An **Arduino microcontroller** paired with an Infrared (IR) Proximity Sensor. It handles physical edge computing—detecting human movement and pushing compact signaling payloads down the wire.
2. **The Gateway Layer (Bridge Server):** A **Node.js** environment executing a custom proxy server. It utilizes the `serialport` engine to intercept raw serial streams from the USB bus and immediately re-broadcasts them onto a local network socket using the open-source `ws` library.
3. **The Presentation Layer (User Interface):** A responsive single-page web app built with **React** and styled via **Tailwind CSS**. It communicates natively with the Gateway using the browser's global **WebSocket API** to compute immediate, frame-synchronized DOM mutations.
