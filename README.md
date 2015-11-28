http-troll
==========

## About

This tool is nice to simulate slow or fickle webservices. Once started, it provides you a HTTP endpoint pointing 
to your origin of choice.

You can configure random response times and a HTTP 503 response ratio.

## Installation

```javascript
npm install http-troll -g // <- global required
```

## Usage

Start reverse proxy to `example.com`, listening on port 7000 with enabled access log.

```bash
troll http://example.com -p 7000 --access-log
```

### Options
```
Usage: troll http://example.com [OPTIONS]

  -p, --port=ARG    port for proxy to listen on
  -l, --access-log  print access log
  -r, --replay      replays previously made calls
  -h, --help        display this help
```

### Configure via console

Once the server is started, you can just start typing those commands. They will be applied immediately. 

#### Set error rate to 50%

```
Just type in your terminal: 50%
```

#### Set response time delay to randomly 50-150ms

```
Just type in your terminal: 50,150
```

#### Stop the troll

```
Just type... ye you guess it: stop
```

### Configure via HTTP

Once started, it can be configured via console or http api. These changes will be applied immediately.

#### set response time to 20 to 500ms

```bash
curl -H 'response-times: 20,500' http://localhost:7000/configure
```

#### set HTTP 503 ratio to 40%

```bash
curl -H 'error-503: 0.4' http://localhost:7000/configure
```
