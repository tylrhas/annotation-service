const cors = require('cors')
const sequelize = require('sequelize')
const { Op } = sequelize
const models = require('../../models/primary')

const whitelist = [
  /chrome-extension:\/\/[a-z]*$/
]
const corsOpts = {
  origin: (origin, callback) => {
    if (whitelist.some(pattern => pattern.test(origin)) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  preflightContinue: true,
  methods: 'GET'
}

module.exports = (app) => {
  app.options('/api/hub/clients', cors(corsOpts))
  app.options('/api/hub/clients/:clientUrn/locations', cors(corsOpts))
  app.options('/api/hub/location/:locationUrn', cors(corsOpts))

  app.get('/api/hub/location/:locationUrn', cors(corsOpts), async (req, res) => {
    const location = await models.g5_updatable_location.findOne({
      where: {
        urn: req.params.locationUrn
      }
    })
    const client = await models.g5_updatable_client.findOne({
      where: {
        urn: location.dataValues.client_urn
      }
    })
    res.json({ clientUrn: client.dataValues.urn, locationUrn: location.dataValues.urn })
  })

  app.get('/api/hub/clients/:clientUrn/locations', cors(corsOpts), async (req, res) => {
    const { clientUrn } = req.params
    const locations = await models.g5_updatable_location.getByClientUrn(clientUrn)
    res.json(locations)
  })

  app.get('/api/hub/clients', cors(corsOpts), async (req, res) => {
    const { internal, activeDa } = req.query
    let clients
    const where = {
      properties: {
        status: { [Op.not]: 'Deleted' }
      }
    }
    if (activeDa !== 'false') {
      where.properties.search_analyst = { [Op.not]: null }
    }
    if (internal !== 'false') {
      clients = await models.g5_updatable_client.findAll({
        where,
        attributes: [
          'urn',
          'name',
          [sequelize.json('properties.branded_name'), 'brandedName']
        ],
        order: [
          ['name', 'asc']
        ]
      })
    } else {
      where.properties.g5_internal = false
      clients = await models.g5_updatable_client.getAllNonInternal(where)
    }
    res.json(clients)
  })
}
