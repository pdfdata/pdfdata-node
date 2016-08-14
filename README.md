# pdfdata-node ![](https://travis-ci.org/pdfdata/pdfdata-node.svg?branch=master)

A node.js client library for [PDFDATA.io](https://www.pdfdata.io) (PDF data
extraction as-a-service)

Coming soon! For now, go ahead and watch this repo so you know when
`pdfdata-node` is ready, or you can hit our HTTP API "directly"; check our
[detailed documentation](https://www.pdfdata.io/apidoc/).

Questions? We're on Twitter [@pdfdataio](https://twitter.com/pdfdataio), or you
can [contact us](https://www.pdfdata.io/page/contact) otherwise.

## Testing

Set your environment, e.g.:

```
export PDFDATA_APIKEY=<YOUR API KEY>
export PDFDATA_ENDPOINT=https://localhost:8081/v1
```

`PDFDATA_ENDPOINT` defaults to `https://api.pdfdata.io/v1`.

Run the tests via `npm test`, or `node_modules/mocha/bin/mocha --watch` if you
want to watch for changes while developing.
