# pdfdata-node ![](https://travis-ci.org/pdfdata/pdfdata-node.svg?branch=master)

A node.js client library for [PDFDATA.io](https://www.pdfdata.io), the API for
PDF data extraction.

PDFDATA.io is designed to be incredibly easy to use while providing impeccable
PDF data extraction quality over a range of configurable extraction targets
(text, forms, metadata, images, tables, and more all the time). While
PDFDATA.io's API is itself an approachable HTTP+JSON affair, `pdfdata-node`
provides an idiomatic, promise-based JavaScript library that any node.js
developer can have up and running in less than a minute.

<strong>For detailed documentation and extensive examples, head over to our
[API docs](https://www.pdfdata.io/apidoc/).</strong>

## Quick Start

### Installation

```
$ npm install pdfdata
```

### Usage

You will need a PDFDATA.io API key to use this library. (If you don't have one
already, you can get one free by
[registering](https://www.pdfdata.io/register).)

#### Credentials

First, you'll need to plug in your PDFDATA.io API key; there are two ways you
can do this. Either provide it as a constructor argument to the result of
requiring the `pdfdata` module:

```js
var pdfdata = require("pdfdata")("test_YOUR_API_KEY_HERE");
```

Or, you can set the `PDFDATA_APIKEY` environment variable appropriately for your
operating system, e.g.:

```sh
export PDFDATA_APIKEY=test_YOUR_API_KEY_HERE
```

and then omit the extra argument when requiring `pdfdata`:

```js
var pdfdata = require("pdfdata")();
```

#### Running a proc (data extraction process)

Assuming you have a PDF document `test.pdf` in your current directory which
contains text you'd like to extract:

```js
pdfdata.procs.configure()
    .operation({op:"text"})
    .withFiles(["test.pdf"])
    .start()
    .then(console.log);
```

This will yield something like this:

```js
{ type: 'proc',
  id: 'proc_156870e759a',
  created: '2016-08-14T03:18:07Z',
  source_tags: [],
  operations: [ { op: 'text' } ],
  documents: 
   [ { type: 'doc',
       id: 'doc_8e96ec0533ac3e1e988b7d1ca27bfdc096b82ddc',
       filename: 'document.pdf',
       tags: [ 'acquired:2016-08-08', 'acquired:2016-08-14' ],
       created: '2016-08-08T19:35:16Z',
       expires: '2016-09-13T03:18:07Z',
       results: 
        [ { op: 'text',
            data: 
            [ { text: '\n                              Center        for    Bioinformatics                &\n                                     Molecular           Biostatistics\n                                   (University   of California, San  Francisco)\n\n                            Year 2005                                                     Paper dlbcl\n\n\n\n\n\n                          Microarray        Gene     Expression       Data     with\n                            Linked      Survival     Phenotypes:...' } ]
          } ] } ] }
```

There are many different data extraction operations available; unstructured text
as is shown above, as well as access to bitmap image data, metadata, and
structured data options like forms, and custom named-region page template
extractions.

### Learn more

Seriously, please check out our
[API documentation](https://www.pdfdata.io/apidoc/), which includes a tonne of
examples, descriptions of all of the data extraction operations PDFDATA.io
offers, and details about important things like data retention policies, usage
limits, and so on.

Questions? We're on Twitter [@pdfdataio](https://twitter.com/pdfdataio), or you
can [contact us](https://www.pdfdata.io/page/contact) otherwise.

## Testing

(This is only relevant if you are modifying / contributing to `pdfdata-node`.)

Set your environment, e.g.:

```
export PDFDATA_APIKEY=<YOUR API KEY>
export PDFDATA_ENDPOINT=https://localhost:8081/v1
```

`PDFDATA_ENDPOINT` defaults to `https://api.pdfdata.io/v1`.

Run the tests via `npm test`, or `node_modules/mocha/bin/mocha --watch` if you
want to watch for changes while developing.

## License

MIT.
