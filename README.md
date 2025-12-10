<p align="center"> 
    <img src=".github/logo.svg" width="200" alt="Outline Logo"> 
</p>

<h2 align="center">Outline Dashboard</h2>

Outline Admin is a web interface for the Outline Manager API, providing a simple and user-friendly UI for managing VPN
servers.

![Build](https://github.com/AmRo045/OutlineAdmin/actions/workflows/build.yml/badge.svg)
![CodeQL](https://github.com/AmRo045/OutlineAdmin/actions/workflows/github-code-scanning/codeql/badge.svg)
[![Docker Pulls](https://img.shields.io/docker/pulls/amro045/outline-admin.svg?maxAge=604800)](https://hub.docker.com/r/amro045/outline-admin/)

A clean and modern web dashboard for **Outline Manager API** — built for managing VPN servers, access keys, Dynamic Access Keys (DAKs), health checks, notification channels, tags, and prefixes.

---

## Live Demo

- Dashboard: **https://outline.netfusion.space**

---

## Added Features

The following features have been added to extend the functionality of the Outline Manager API:

### Dynamic Access Keys

Dynamic Access Keys (DAKs) provide a flexible way to manage Outline access keys by dynamically creating, deleting, and
updating them as needed. This allows the connection configuration to be updated without regenerating or redistributing
new keys.

In Outline Admin, DAKs are enhanced beyond the official Outline implementation, adding automated management and server
pooling features.

#### Self-Managed DAKs

A Self-Managed DAK automatically manages its associated access keys. When a client requests access and no key exists,
the system will create one on demand. If a key expires or reaches its data limit, the underlying access keys will be
removed automatically. Example of an auto-generated access key name: `self-managed-dak-access-key-{dak_id}`. These
access keys are hidden in Outline Admin but remain visible in Outline Manager.

Self-Managed DAKs use a server pool to decide where to create new access keys. You can choose how this pool is formed
using one of the following modes:

Self-Managed DAKs use a server pool to decide where to create new access keys. You can choose how this pool is formed
using one of the following modes:

#### Manual Server Selection

In this mode, available servers are listed, and you can manually select one or more servers to include in the server
pool. When the DAK creates an access key automatically, it will select one of these servers.

#### Tag-Based Server Selection

Instead of manually selecting servers, you can assign tags to servers (for example, `EU`, `US`, `High-Speed`, or
`Irancell`). When creating a Self-Managed DAK, you can choose which tags to include. The DAK will then automatically use
all servers matching those tags to form its pool.

#### Manual DAKs

A Manual DAK does not automatically create or remove access keys. Instead, the admin attach/detach access keys manually
— similar to the official Outline dynamic access keys.

### Health Check

Outline Admin includes an automated Health Check system to monitor the status and availability of your servers.

When you add a new server to Outline Admin, a health check is automatically created for that server. You can configure
the check interval (how often the server is tested) and notification cooldown (how long to wait before sending another
alert) in the Health Checks section.

### Notification Channels

To ensure you’re promptly informed about server issues, Outline Admin lets you define and manage notification channels.

For example, you can set up a Telegram notification channel and link it to your server’s health check. If the server
becomes unreachable or fails its check, Outline Admin will automatically send a notification through your chosen
channel.

### Expiration Date

Outline Admin lets you set an expiration date for both standard access keys and dynamic access keys. When an access key
reaches its expiration date, it will be automatically disabled, preventing any further connections.

### Tags

Tags provide a simple and flexible way to organize and group servers in Outline Admin. You can assign one or more tags
to each server — for example, `EU`, `US`, `Asia`, `High-Speed` or `Irancell`.

### Prefix

**Prefixes** allow you to disguise Shadowsocks connections so they appear similar to other allowed network protocols.
This helps bypass firewalls that block or inspect encrypted traffic by making Outline connections look like familiar
protocols such as `HTTP`, `TLS`, `DNS`, or `SSH`.

A prefix is a short sequence of bytes added at the start of a Shadowsocks connection. The port number used should
typically match the protocol that the prefix is mimicking — for example, port `80` for `HTTP` or `443` for `HTTPS`.

In Outline Admin, prefixes can be configured for both static and dynamic access keys. Admins can define and assign
prefixes to help users connect more reliably in restricted networks.

Example use cases:

Simulate `HTTP` requests (`"POST "` → port `80`)

Simulate `TLS` traffic (`"\u0016\u0003\u0001\u0000\u00a8\u0001\u0001"` → port `443`)

Simulate `SSH` handshakes (`"SSH-2.0\r\n"` → port `22`)

> [!NOTE] Prefixes should be no longer than 16 bytes. Longer prefixes can cause salt collisions, which may reduce
> encryption safety.

---

## Installation

### Docker

```bash
docker run -d -p 3000:3000 \
  --name outlinedashboard \
  -v ./oa_data:/app/data \
  -v ./logs:/app/logs \
  --restart unless-stopped \
  skylinkvpnchannel/outlinedashboard:latest
```

#### Docker Compose

To simplify the installation, you can use a Docker Compose file:

```bash
docker-compose up -d
```

### NodeJS

Requirements:

Node.js v20+

npm v10+

#### Step 1: Prepare the project files

```bash
git clone https://github.com/skylinkvpnchannel/Outlinedashboard.git
cd Outlinedashboard
cp .env.example .env
npm install

npx prisma migrate deploy
npx prisma generate

npm run compile
npm run setup
npm run build

cd .next/standalone
node server.js

```

#### Step 2: Nginx Reverse Proxy (HTTPS)

```bash
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

```

#### Step 3: Updating

```bash
git pull origin main
npm install
npm run build
pm2 restart outlinedashboard   # or your process manager

```

#### Step 4: Admin Password

Docker:

```bash
docker exec -it outlinedashboard npm run password:change "new password"
```

Non-docker:

```bash
npm run password:change "new password"
```

## Screenshots

![Login](/.github/screenshots/1-login.png) ![Servers](/.github/screenshots/2-servers.png)
![New server](/.github/screenshots/3-new-server.png) ![Server settings](/.github/screenshots/4-server-settings.png)
![Server metrics](/.github/screenshots/5-server-metrics.png)
![Server access keys](/.github/screenshots/6-server-access-keys.png)
![Dynamic access keys](/.github/screenshots/7-dynamic-access-keys.png)
![New dynamic access key](/.github/screenshots/8-new-dynamic-access-key.png)
![Health checks](/.github/screenshots/9-health-checks.png)
![Notification channels](/.github/screenshots/10-notification-channels.png)
![New notification channels](/.github/screenshots/11-new-notification-channel.png)
![Tags](/.github/screenshots/12-tags.png)
