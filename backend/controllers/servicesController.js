import { services } from '../data/beutyServices.js'
const getServices = (req, res) => {
  res.json(services)
}

export {
  getServices
}
