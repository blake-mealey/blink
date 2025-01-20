# Blink

A simple self-hostable URL shortener built with Next.js and Upstash Redis.

## Developing

- Install dependencies with `pnpm install`
- Run dev server with `pnpm dev`

## Configuration

- Configure the Redis connection with the environment variables:
  - `BLINK_KV_REST_API_URL`: your Upstash API URL
  - `BLINK_KV_REST_API_TOKEN`: your Upstash REST API token
- Configure the session signing secret with the environment variable:
  - `BLINK_SESSION_SECRET`: a random string of 32 characters or more

## Setup

The first time the application launches, it will prompt you to create an admin password. After this it will
require that password to access the admin dashboard. You may change the admin password from the Settings menu
in the dashboard.

There is no "reset password" functionality. If you forget your admin password, you can delete the
`@admin-password` key from your Redis database then launch the app and it will reprompt you to create a
password.

## Deploy on Vercel

The easiest way to deploy Blink is to use the [Vercel Platform](https://vercel.com/new).

You can also create and connect your Upstash Redis database using the [Upstash Vercel integation](https://upstash.com/docs/redis/howto/vercelintegration).
