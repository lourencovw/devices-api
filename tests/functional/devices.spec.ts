import { test } from '@japa/runner'


test.group('Devices', (group) => {
  group.setup(() => {
    // tests rely on the app http server from configureSuite in bootstrap
  })

  test('create a device', async ({ client, assert }) => {
    const payload = { name: 'Phone X', brand: 'Acme' }
    const res = await client.post('/devices').json(payload)

    res.assertStatus(201)
    const body = res.body()
    assert.equal(body.name, payload.name)
    assert.equal(body.brand, payload.brand)
    assert.equal(body.state, 'available')
  })

  test('list devices and filter by brand and state', async ({ client }) => {
    // create two devices with different brand and state
    await client.post('/devices').json({ name: 'A', brand: 'BrandA', state: 'available' })
    await client.post('/devices').json({ name: 'B', brand: 'BrandB', state: 'inactive' })

    const all = await client.get('/devices')
    all.assertStatus(200)

    const byBrand = await client.get('/devices').qs({ brand: 'BrandA' })
    byBrand.assertStatus(200)

    const byState = await client.get('/devices').qs({ state: 'inactive' })
    byState.assertStatus(200)
  })

  test('cannot update createdAt and cannot update name/brand when in-use', async ({ client }) => {
    const create = await client.post('/devices').json({ name: 'X', brand: 'Y' })
    create.assertStatus(201)
    const id = create.body().id

    // try update createdAt
    const upd1 = await client.patch(`/devices/${id}`).json({ createdAt: '2020-01-01' })
    upd1.assertStatus(400)

    // set device to in-use directly
    await client.patch(`/devices/${id}`).json({ state: 'in-use' })

    // now try to update name
    const upd2 = await client.patch(`/devices/${id}`).json({ name: 'NewName' })
    upd2.assertStatus(400)
  })

  test('cannot delete device in-use', async ({ client }) => {
    const create = await client.post('/devices').json({ name: 'ToDelete', brand: 'D' })
    create.assertStatus(201)
    const id = create.body().id

    await client.patch(`/devices/${id}`).json({ state: 'in-use' })

    const del = await client.delete(`/devices/${id}`)
    del.assertStatus(400)
  })
})