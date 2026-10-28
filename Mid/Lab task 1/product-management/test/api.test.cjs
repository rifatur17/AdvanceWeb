const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
require('dotenv/config');
require('reflect-metadata');

// Never run destructive test cleanup against the normal application database.
const testDatabase = process.env.TEST_DB_DATABASE;
if (!testDatabase || !testDatabase.endsWith('_test') || testDatabase === process.env.DB_DATABASE) {
  throw new Error('Set TEST_DB_DATABASE to a separate database ending in _test');
}
process.env.DB_DATABASE = testDatabase;
const { NestFactory } = require('@nestjs/core');
const { DataSource } = require('typeorm');
const { AppModule } = require('../dist/app.module');
const { configureApp } = require('../dist/common/configure-app');
const { dataSourceOptions } = require('../dist/config/database.config');

test('Products and Employees use real PostgreSQL records', async (t) => {
  const database = new DataSource(dataSourceOptions);
  let app;
  let base;
  const saved = [];
  async function start() {
    app = await NestFactory.create(AppModule, { logger: false });
    configureApp(app);
    await app.listen(0, '127.0.0.1');
    base = await app.getUrl();
  }
  async function call(method, path, body, expected) {
    const res = await fetch(base + path, {
      method,
      headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json();
    assert.equal(res.status, expected, JSON.stringify(data));
    return data;
  }
  try {
    await database.initialize();
    await database.runMigrations();
    await start();
    for (const [resource, body, patch] of [
      ['products', { name: 'Notebook', category: 'Stationery', price: 125.5, quantity: 20 }, { price: 135.75, quantity: 12 }],
      ['employees', { name: 'Lab Employee', email: 'lab@example.com', phone: '+8801700000000', password: 'dummy-only', age: 25, yearsOfWorking: 3 }, { phone: '+8801800000000', yearsOfWorking: 4 }],
    ]) {
      let first;
      let second;
      await t.test(`${resource}: create two saved records`, async () => {
        first = await call('POST', '/' + resource, body, 201);
        saved.push([resource, first.id]);
        second = await call('POST', '/' + resource, { ...body, name: 'Second record' }, 201);
        saved.push([resource, second.id]);
        assert.match(first.id, /^[0-9a-f-]{36}$/);
        assert.notEqual(first.id, second.id);
        assert.deepEqual(first, { id: first.id, ...body });
      });
      await t.test(`${resource}: list and get by UUID`, async () => {
        const all = await call('GET', '/' + resource, undefined, 200);
        assert(all.some(x => x.id === first.id));
        assert(all.some(x => x.id === second.id));
        assert.deepEqual(await call('GET', `/${resource}/${first.id}`, undefined, 200), first);
      });
      await t.test(`${resource}: PATCH returns and persists changed fields`, async () => {
        const expected = { ...first, ...patch };
        assert.deepEqual(await call('PATCH', `/${resource}/${first.id}`, patch, 200), expected);
        assert.deepEqual(await call('GET', `/${resource}/${first.id}`, undefined, 200), expected);
        first = expected;
      });
      await t.test(`${resource}: persistence after application and database reconnect`, async () => {
        await app.close();
        await database.destroy();
        await database.initialize();
        await start();
        assert.deepEqual(await call('GET', `/${resource}/${first.id}`, undefined, 200), first);
        const rows = await database.query(`SELECT id FROM ${resource} WHERE id = $1`, [first.id]);
        assert.equal(rows[0].id, first.id);
      });
      for (const method of ['GET', 'PATCH', 'DELETE']) {
        await t.test(`${resource}: ${method} invalid UUID is 400; missing record is 404`, async () => {
          const payload = method === 'PATCH' ? patch : undefined;
          await call(method, `/${resource}/invalid-id`, payload, 400);
          await call(method, `/${resource}/${randomUUID()}`, payload, 404);
        });
      }
      await t.test(`${resource}: reject missing, unknown, null, empty and invalid fields`, async () => {
        await call('POST', '/' + resource, {}, 400);
        await call('POST', '/' + resource, { ...body, unexpected: true }, 400);
        await call('POST', '/' + resource, { ...body, id: randomUUID() }, 400);
        await call('POST', '/' + resource, { ...body, name: '   ' }, 400);
        await call('PATCH', `/${resource}/${first.id}`, {}, 400);
        await call('PATCH', `/${resource}/${first.id}`, { name: null }, 400);
        await call('PATCH', `/${resource}/${first.id}`, { unexpected: true }, 400);
        const invalidBodies = resource === 'products'
          ? [{ price: -1 }, { price: '10' }, { quantity: 1.5 }, { quantity: -1 }, { quantity: 2147483648 }]
          : [{ email: 'bad' }, { phone: 123 }, { password: '' }, { age: -1 }, { age: 1.5 }, { yearsOfWorking: -1 }, { yearsOfWorking: 1.5 }];
        for (const invalid of invalidBodies) {
          await call('POST', '/' + resource, { ...body, ...invalid }, 400);
          await call('PATCH', `/${resource}/${first.id}`, invalid, 400);
        }
      });
      await t.test(`${resource}: DELETE and confirm absence`, async () => {
        const response = await call('DELETE', `/${resource}/${first.id}`, undefined, 200);
        assert.equal(response.id, first.id);
        const all = await call('GET', '/' + resource, undefined, 200);
        assert(!all.some(x => x.id === first.id));
        assert(all.some(x => x.id === second.id));
        await call('GET', `/${resource}/${first.id}`, undefined, 404);
        await call('DELETE', `/${resource}/${first.id}`, undefined, 404);
        await call('PATCH', `/${resource}/${first.id}`, patch, 404);
      });
    }
    await t.test('Database constraints reject negative values independently of DTO validation', async () => {
      await assert.rejects(database.query(
        'INSERT INTO products (name, category, price, quantity) VALUES ($1,$2,$3,$4)',
        ['Invalid', 'Test', -1, 1],
      ), err => err.driverError.code === '23514');
    });
    await t.test('Database error filter returns a safe response without SQL details', async () => {
      // A temporary trigger on the isolated test database forces a real query failure.
      await database.query(`CREATE FUNCTION lab_test_reject() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private database detail' USING ERRCODE = '23514'; END $$`);
      try {
        await database.query('CREATE TRIGGER lab_test_reject BEFORE INSERT ON products FOR EACH ROW EXECUTE FUNCTION lab_test_reject()');
        const data = await call('POST', '/products', { name: 'Trigger test', category: 'Test', price: 1, quantity: 1 }, 400);
        assert.deepEqual(data, { statusCode: 400, message: 'Values do not satisfy database constraints' });
      } finally {
        await database.query('DROP TRIGGER IF EXISTS lab_test_reject ON products');
        await database.query('DROP FUNCTION IF EXISTS lab_test_reject()');
      }
    });
  } finally {
    if (app) await app.close();
    if (database.isInitialized) {
      for (const [table, id] of saved) await database.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
      await database.destroy();
    }
  }
});
