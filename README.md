# Astrologs
[![wakatime](https://wakatime.com/badge/user/a486a2a9-9713-41d8-951b-807f91406cb1/project/885b277e-283c-435a-a5c8-260266fca1fc.svg)](https://wakatime.com/badge/user/a486a2a9-9713-41d8-951b-807f91406cb1/project/885b277e-283c-435a-a5c8-260266fca1fc)

> Astrologs is a modern web application designed to allow astronomy enthusiasts to manage their equipment, create astrophotography sessions and view sky conditions in real time.

---

## Features

- Equipment management (telescopes, cameras, mounts, filters)
- Monitoring of technical specifications
- Visualization of lunar phases
- Analysis of meteorological and atmospheric conditions
- Evaluation of observation quality (clouds, humidity, wind)
- Geolocation and search by city
- Account authentication and management
- Generation of statistics from sessions

---

## Tech Stack

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**
- **PostgreSQL**
- **Prisma**

---

## Installation

```bash
git clone https://github.com/axelio-dev/astrologs.git
cd astrologs
npm install
```

---

## Environment Variables

Copy the example file and modify it with your actual settings :

```bash
cp .env.example .env
```

---

## Database Setup
```bash
npx prisma migrate dev
npx prisma generate
```

---

## Run the Project

```bash
npm run dev
```

App runs on:
```bash
http://localhost:3000
```

## License

This project is licensed under the MIT License.
You are free to use, modify, and distribute this project.