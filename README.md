![Logo of the project](./images/robot-1.png)
<!-- Base icon made by Roundicons on www.flaticon.com -->

# UpBot

> An awesome little Slack bot to help update and communicate the stuses of a
  project's services to Slack

Welcome to **UpBot**! I'm a bot app that connects to Slack and responds to
requests for the current status of services that are being monitored by `upbot`
and allows authorised users to update the statuses and register new services to
be monitored.

## Installing & getting started

Upbot can be installed either from source or as a `docker` image. It requires
a Redis server for data storage.

## Developing

The `upbot` project is maintained in the Home Office GitHub organisation. As an
open source project you are free to clone and install the project with the
following command:

```
git clone ssh://git@github.com:UKHomeOffice/upbot.git
cd upbot
npm i --only=dev
```

Once cloned you can run the application (and Redis database) using
`docker-compose up` from the project's root directory. This will launch two
containers; one running the app and one running the Redis database.

```
# launch the app and database locally in Docker containers
docker-compose up
```

## Building and Publishing

This application is intended to be built and published as a docker app using
`docker build` based on the project's `Dockerfile`.

```
docker build -t homeoffice/upbot:0.0.2 .
```

The current `docker` image is published to Quay.

## Deploying

The application is deployed as `docker` container(s). If you only want to
deploy locally we recommend using `docker-compose` otherwise you should `docker
pull` the image from Quay.


### Deploying locally

The following command will deploy `upbot` along with a fresh, standalone Redis
server:

```
git clone ssh://git@gitlab.digital.homeoffice.gov.uk:2222/dacc-dq/upbot.git
cd upbot
docker-compose up
```

### Deploying in Production

> Update this section once the image is hosted on Quay

## Configuration

`upbot` requires certain environment variables to be present. These are:

* the redis connection requires a `host` and `port` - set in `UPBOT_REDIS_HOST`
  & `UPBOT_REDIS_PORT`)
* the Slack API token to use - set in `HODQ_SLACK_API_TOKEN`

You will usually want to treat the Slack API token as a `secret`.

### Currently using `config.yaml` for setting the intents

`upbot` uses a `config.yaml` file to register the phrases that `upbot` monitors
for to determine intent. For a standard deployment you can leave this file as
is. This method may be changed in the future.

## Running the application locally (not in a container)

Running `upbot` is really simple, just:

```
# at the project's root directory
npm start
```

## Features

`upbot` is a simple Slack bot that helps the DevOps team quickly manage the
status of the team's services, directly from Slack.

Currently `upbot` provides the following features:

- register new services
- update a service's status (including a timestamp of when the status last
  changed)
- list the services currently being monitored
- request the current state of all services

Further features are currently work-in-progress and some are still to be
imagined.

> One feature that we intend to add soon is to allow a (short) message to be
  entered when updating a service's status, so that the message can be used to
  provide context to those viewing the status. This is currently work in
  progress.

## Contributing

Feel free to `fork` our project and/or open any `issues`, we appreciate all
input and feedback.

The following people have contributed to the development of `upbot`:

- Tom Fitzherbert

## Licensing

`upbot` is released under the MIT license.

## Credits

Our logo is based on an icon made by
[Roundicons](http://www.flaticon.com/authors/roundicons) from www.flaticon.com
