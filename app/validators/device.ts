import vine from '@vinejs/vine'

/**
 * Validates the post's creation action
 */
export const createDeviceValidator = vine.compile(
  vine.object({
    name: vine.string().trim(),
    brand: vine.string().trim().maxLength(50),
    state: vine.enum(['available', 'in-use', 'inactive'] as const).optional(),
  })
)

/**
 * Validates the post's update action
 */
export const updateDeviceValidator = vine.compile(
  vine.object({
    name: vine.string().trim().optional(),
    brand: vine.string().trim().optional(),
    state: vine.enum(['available', 'in-use', 'inactive'] as const).optional(),
  })
)