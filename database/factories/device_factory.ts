import factory from '@adonisjs/lucid/factories'
import Device from '#models/device'

export const DeviceFactory = factory
  .define(Device, async ({ faker }) => {
    const states = Device.STATES
    return {
      name: faker.word.words(2),
      brand: faker.company.name(),
      state: states[Math.floor(Math.random() * states.length)],
    }
  })
  .build()