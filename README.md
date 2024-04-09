# community-db

A database for community.  Keeping record of household within small community, events, memberships, etc..

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Setting up mongodb

The mongo DB must be configured with replication set:

- stop mongo service: `brew services stop mongodb-community`

- update mongo config `$(brew --prefix)/etc/mongod.conf` file with replication props:

    ```sh
    systemLog:
      destination: file
      path: /usr/local/var/log/mongodb/mongo.log
      logAppend: true
    storage:
      dbPath: /usr/local/var/mongodb
    net:
      bindIp: 127.0.0.1
    replication:
      replSetName: "rs0"
    ```

- start mongo service: `brew services start mongodb-community`

- while mongod is running, run `mongosh`, then:

    ```sh
    rs.initiate({_id: 'rs0', members: [{_id: 0, host: 'localhost:27017'}]});
    ```