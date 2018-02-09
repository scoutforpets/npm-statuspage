# Introduction

This is a simple promise-based library to interact with the [statuspage.io](https://statuspage.io) API.

# Usage

In your code, simply:

```javascript
const StatusPage = require('statuspage')
const status = new StatusPage(apiKey, pageId)
```

# Supported Operations
This ever-growing list, currently supports:

- `updateMetric(metricId, val)`
- `updateComponentState(componentId, status, componentName)`
- `getComponents()`
- `createComponent(componentName)`
- `deleteComponent(componentId)`
- `createSubscriber(subscriberData)` (see [API docs](https://doers.statuspage.io/api/v1/subscribers/) for available fields)
- `deleteSubscriber(subscriberId)`

All of these methods return a promise for you to handle, with the exception of `getComponents` that is marked as `async` and will return the response data. 
