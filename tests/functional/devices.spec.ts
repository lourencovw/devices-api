import Device from '#models/device'
import { test } from '@japa/runner'

test.group('Devices', (group) => {
  group.setup(() => {
    // run migrations or any setup needed before tests

  })

  test('create a device', async ({ client, assert }) => {
    const payload = { name: 'Phone X', brand: 'Acme' }

    const res = await client.post('/devices').json(payload)

    res.assertStatus(201)
    assert.equal(res.body().name, payload.name)
    assert.equal(res.body().brand, payload.brand)
    assert.equal(res.body().state, 'available')
  })

  test('list devices and filter by brand and state', async ({ client }) => {
    await Device.create({ name: 'A', brand: 'BrandA', state: 'available' })
    await Device.create({ name: 'B', brand: 'BrandB', state: 'inactive' })

    const all = await client.get('/devices')
    const byBrand = await client.get('/devices').qs({ brand: 'BrandA' })
    const byState = await client.get('/devices').qs({ state: 'inactive' })

    all.assertStatus(200)
    byBrand.assertStatus(200)
    byState.assertStatus(200)
  })

  test('cannot update cannot update name/brand when in-use', async ({ client, assert }) => {
    const create = await Device.create({ name: 'Device1', brand: 'Brand1' })
    const id = create.id

    const updateState = await client.patch(`/devices/${id}`).json({ state: 'in-use' })
    const updateName = await client.patch(`/devices/${id}`).json({ name: 'NewName' })
    const updateBrand = await client.patch(`/devices/${id}`).json({ brand: 'NewBrand' })

    updateState.assertStatus(200)
    updateName.assertStatus(400)
    assert.equal(updateName.body().error, 'cannot update name or brand when device is in use')
    updateBrand.assertStatus(400)
    assert.equal(updateBrand.body().error, 'cannot update name or brand when device is in use')
  })
  test('cannot update createdAt field', async ({ client, assert }) => {
    const { id, createdAt } = await Device.create({ name: 'Device2', brand: 'Brand2' });

    const update = await client
      .patch(`/devices/${id}`)
      .json({ name: 'updated', createdAt: '1999-02-02' });
    const { createdAt: createdAtAfter } = await Device.findOrFail(id);

    update.assertStatus(200);
    assert.equal(createdAt.toISODate(), createdAtAfter.toISODate());
  })
  test('cannot delete device in-use', async ({ client }) => {
    const create = await Device.create({ name: 'Device3', brand: 'Brand3' })
    const id = create.id

    await client.patch(`/devices/${id}`).json({ state: 'in-use' })

    const del = await client.delete(`/devices/${id}`)
    del.assertStatus(400)
    del.assertBody({ error: 'cannot delete a device that is in use' })
  })
})