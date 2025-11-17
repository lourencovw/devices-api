/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import DevicesController from '#controllers/devices_controller'
import router from '@adonisjs/core/services/router'

router.resource('devices', DevicesController)

