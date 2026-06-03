import axios from 'axios'
import { getDeviceId } from './deviceId'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  config.headers['x-device-id'] = getDeviceId()
  return config
})

export default api
