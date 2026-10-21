const { test } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/app');

test('POST /todos cria uma tarefa', async () => {
  const res = await request(app).post('/todos').send({ title: 'Estudar Docker' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.body.title, 'Estudar Docker');
  assert.strictEqual(res.body.done, false);
});

test('POST /todos sem title retorna 400', async () => {
  const res = await request(app).post('/todos').send({});
  assert.strictEqual(res.status, 400);
});

test('GET /todos lista as tarefas', async () => {
  const res = await request(app).get('/todos');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
  assert.ok(res.body.length >= 1);
});

test('PUT /todos/:id atualiza a tarefa', async () => {
  const { body: created } = await request(app).post('/todos').send({ title: 'Tarefa' });
  const res = await request(app).put(`/todos/${created.id}`).send({ done: true });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.done, true);
});

test('PUT /todos/:id inexistente retorna 404', async () => {
  const res = await request(app).put('/todos/9999').send({ done: true });
  assert.strictEqual(res.status, 404);
});

test('DELETE /todos/:id remove a tarefa', async () => {
  const { body: created } = await request(app).post('/todos').send({ title: 'Apagar' });
  const res = await request(app).delete(`/todos/${created.id}`);
  assert.strictEqual(res.status, 204);
  const again = await request(app).delete(`/todos/${created.id}`);
  assert.strictEqual(again.status, 404);
});
