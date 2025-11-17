import type { HttpContext } from '@adonisjs/core/http'
import Device from '#models/device'

export default class DevicesController {
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

	public async show({ params }: HttpContext) {
		const device = await Device.findOrFail(params.id)
		return device
	}

	public async store({ request, response }: HttpContext) {
		const payload = request.only(['name', 'brand', 'state'])

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

	public async update({ params, request, response }: HttpContext) {
		const device = await Device.findOrFail(params.id)
		const payload = request.only(['name', 'brand', 'state', 'createdAt'])

        if (payload.createdAt) {
            return response.badRequest({ error: 'createdAt cannot be updated' })
        }

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

	public async destroy({ params, response }: HttpContext) {
		const device = await Device.findOrFail(params.id)

		if (device.state === 'in-use') {
			return response.badRequest({ error: 'cannot delete a device that is in use' })
		}

		await device.delete()
		return response.noContent()
	}
}