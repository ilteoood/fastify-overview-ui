const assert = require('node:assert')
const { test } = require('node:test')
const fs = require('fs')
const path = require('path')
const fastify = require('fastify')
const plugin = require('../')

assert.ok(
  fs.existsSync(path.join(__dirname, '../dist')),
  'please execute npm run build'
)

async function build(opts = {}) {
  const app = fastify(opts)
  await app.register(require('fastify-overview'))
  await app.register(plugin)
  app.get('/', async function () {
    return { hello: 'world' }
  })

  return app
}

test('app works', async (t) => {
  const app = await build()
  const response = await app.inject('/')
  t.assert.deepStrictEqual(response.json(), { hello: 'world' })
})

test('plugin root works', async (t) => {
  const app = await build()
  const response = await app.inject('/fastify-overview-ui/')
  t.assert.deepStrictEqual(response.statusCode, 200)
  t.assert.deepStrictEqual(
    response.headers['content-type'],
    'text/html; charset=UTF-8'
  )
})

test('plugin json url works', async (t) => {
  const app = await build()
  const response = await app.inject('/json-overview-ui')
  t.assert.deepStrictEqual(response.statusCode, 200)
  t.assert.deepStrictEqual(
    response.headers['content-type'],
    'application/json; charset=utf-8'
  )
})
