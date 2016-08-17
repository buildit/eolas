### Standalone MongoDB Install

#### Install and run with Docker

Here is a one-liner mongodb install and run using docker:

```sh
$ docker run -p 27017:27017 --name mi-mongo -d mongo:3
```

#### With Brew

```sh
$ brew update
$ brew install mongodb
$ mkdir -p ~/data/db
$ mongodb --dbpath ~/data/db
```

[<-BACK](README.md)
