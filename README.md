# Edge Service

## Installation

- Run `docker compose up` to start the service, queue, and the database.
- Run `npm install` or `yarn install` to install the dependencies for unit testing purposes.

## Testing

Run `npm run test` or `yarn test` to run the unit tests (TODO: get this working inside of docker `yarn test:docker:unit`).

To test the dockerized service, run `npm run test:docker` or `yarn test:docker`. This will send a message to the queue to create an edge between node99 and node101.