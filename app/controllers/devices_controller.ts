import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'
import { createDeviceValidator, updateDeviceValidator } from '#validators/device'

export default class DevicesController {
    /**
     * @index
     * @operationId listDevices
     * @summary List Devices
     * @description Retrieve a list of devices, with optional filtering by brand and state.
     * @responseBody 200 - <Device[]>
     * @responseBody 400 - { error: string }
     * @paramQuery brand - Filter devices by brand (partial match) - @type(string)
     * @paramQuery state - Filter devices by state (exact match) - @type(string)
     */
	public async index({ request }: HttpContext) {
		const { brand, state } = request.qs()

		const query = Device.query()

		if (brand) {// query filter by brand, even not exact match
            query.where('brand', 'like', `%${brand}%`)
		}

		if (state) {// query filter by state, exact match
            query.where('state', state)
		}

		const devices = await query.orderBy('id')
		return devices
	}

    /**
     * @show
     * @operationId getDevice
     * @summary Get Device
     * @description Retrieve a single device by its ID.
     * @responseBody 200 - <Device>
     * @responseBody 404 - { error: string }
     * @paramPath id - The ID of the device to retrieve - @type(number)
     */
	public async show({ params }: HttpContext) {
		const device = await Device.findOrFail(params.id)
		return device
	}

    /**
     * @store
     * @operationId createDevice
     * @summary Create Device
     * @description Create a new device with the provided name, brand, and optional state.
     * @responseBody 201 - <Device>
     * @responseBody 400 - { error: string }
     * @requestBody <Device>.only(name, brand, state)
     */
	public async store({ request, response }: HttpContext) {
		const data = request.only(['name', 'brand', 'state'])
        const payload = await createDeviceValidator.validate(data)
		if (!payload.name || !payload.brand) {
			return response.badRequest({ error: 'name and brand are required' })
		}

		if (payload.state && !Device.STATES.includes(payload.state)) {
			return response.badRequest({ error: 'invalid state' })
		}

		const device = await Device.create({
			name: payload.name,
			brand: payload.brand,
			state: payload.state ?? 'available',
		})

		return response.created(device)
	}

    /**
     * @update
     * @operationId updateDevice
     * @summary Update Device
     * @description Update an existing device's name, brand, or state.
     * @responseBody 200 - <Device>
     * @responseBody 400 - { error: string }
     * @responseBody 404 - { error: string }
     * @paramPath id - The ID of the device to update - @type(number)
     * @requestBody <Device>.only(name, brand, state)
     */
	public async update({ params, request, response }: HttpContext) {
		const device = await Device.findOrFail(params.id)
		const data = request.only(['name', 'brand', 'state']);
        const payload = await updateDeviceValidator.validate(data);

		if (device.state === 'in-use' && (payload.name || payload.brand)) {
			return response.badRequest({ error: 'cannot update name or brand when device is in use' })
		}

		if (payload.state && !Device.STATES.includes(payload.state)) {
			return response.badRequest({ error: 'invalid state' })
		}

		if (payload.name) device.name = payload.name
		if (payload.brand) device.brand = payload.brand
		if (payload.state) device.state = payload.state

		await device.save()

		return device
	}

    /**
     * @destroy
     * @operationId deleteDevice
     * @summary Delete Device
     * @description Delete a device by its ID, only if it is not in use.
     * @responseBody 204 - No Content
     * @responseBody 400 - { error: string }
     * @responseBody 404 - { error: string }
     * @paramPath id - The ID of the device to delete - @type(number)
     */
	public async destroy({ params, response }: HttpContext) {
		const device = await Device.findOrFail(params.id)

		if (device.state === 'in-use') {
			return response.badRequest({ error: 'cannot delete a device that is in use' })
		}

		await device.delete()
		return response.noContent()
	}
}