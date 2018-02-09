const mocha = require('mocha')
const expect = require('expect')

const {describe, it} = mocha

const StatusPage = require('../index.js')

describe('StatusPage', () => {
  it('Should exist', () => {
    expect(
      StatusPage
    ).toExist()

    expect(
      new StatusPage()
    ).toExist()
  })

  it('Should return POST path', () => {
    const pageId = 'MyTestPageId123'
    const s = new StatusPage(undefined, 'MyTestPageId123')
    expect(
      s.generateMetricPostPath('456')
    )
    .toEqual(`/v1/pages/${pageId}/metrics/456/data.json`)
  })

  it('Should generate the request string', () => {
    let s = new StatusPage()
    s.now = () => 42

    expect(
      s.generateRequestParameters('31337')
    ).toEqual('data[timestamp]=42&data[value]=31337')
  })

  it('Should generate API base path', () => {
    const s = new StatusPage(undefined, '123')
    expect(
      s.generatePagePath()
    ).toEqual('/v1/pages/123')
  })

  it('Should generate component status payload', () => {
    const s = new StatusPage(undefined, undefined)
    expect(
      s.generateComponentStatusPayload('stopped')
    ).toEqual('component[status]=stopped')
  })

  it('Should generate component path', () => {
    const s = new StatusPage(undefined, '4567')

    expect(
      s.generateComponentPath('asdf')
    ).toEqual('/v1/pages/4567/components/asdf.json')
  })

  it('Should get components', (done) => {
    let s = new StatusPage()
    s.instance = {
      get: (url) => {
        expect(
          url
        ).toEqual('/v1/pages/undefined/components.json')
        return new Promise((resolve, reject) => {
          resolve({
            data: ['hello', 'world']
          })
        })
      }
    }
    s.getComponents()
    .then(
      (data) => {
        expect(
          data
        ).toEqual(['hello', 'world'])
        done()
      }
    )
  })

  it('Should call createComponent', () => {
    let pageId = 'cvbnm,,'
    let componentName = '1337-c0mp0nent'
    let s = new StatusPage(undefined, pageId)
    s.instance = {
      post: (url, data) => {
        expect(
          url
        ).toEqual(`/v1/pages/${pageId}/components.json`)
        expect(
          data
        ).toEqual(`component[name]=${componentName}`)
      }
    }

    s.createComponent(componentName)
  })

  it('Should generate an appropriate component name payload', () => {
    let s = new StatusPage()
    let name = 'potatoes-component'
    expect(
      s.generateCreateComponentPayload(name)
    ).toEqual(`component[name]=${name}`)
  })

  it('Should update and toggle components correctly', (done) => {
    const status = 'partial_outage'
    const pageId = 'asfawfr'
    const componentId = 'potato1'
    const instance = {
      patch: (url, data) => {
        expect(
          url
        ).toEqual(`/v1/pages/${pageId}/components/${componentId}.json`)
        expect(
          data
        ).toEqual(`component[status]=${status}`)
        done()
      }
    }

    let s = new StatusPage(undefined, pageId)
    s.instance = instance
    s.updateComponentState(
      componentId,
      status,
      undefined
    )
  })

  it('Should create a subscriber', (done) => {
    const pageId = 'asfawfr'
    const subscriber = {
      email: 'elon@spacex.com'
    }
    const instance = {
      post: (url, data) => {
        expect(
          url
        ).toEqual(`/v1/pages/${pageId}/subscribers.json`)
        expect(
          data
        ).toEqual(`subscriber[email]=${subscriber.email}`)
        done()
      }
    }

    let s = new StatusPage(undefined, pageId)
    s.instance = instance
    s.createSubscriber(subscriber)
  })
})
