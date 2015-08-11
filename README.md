http-troll
==========

h2. About

This tool is nice to simulate slow/flattering webservices. You can configure random response times and a HTTP 503 response ratio.

h2. Installation

```javascript
npm install http-troll -g // <- global required
```

h2. Usage

Start reverse proxy to `example.com`, listening on port 7000 with enabled access log.

```bash
troll http://example.com -p 7000 --access-log
```

Once started, it can be configured via http api. These changes will be applied immediately.

h4. set response time to 20 to 500ms

```bash
curl -H 'response-times: 20,500' http://localhost:7000/configure
```

h4. set HTTP 503 ratio to 40%

```bash
curl -H 'error-503: 0.4' http://localhost:7000/configure
```