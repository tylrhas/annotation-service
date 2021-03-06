export const state = () => ({
  client: null,
  clients: [],
  location: null,
  locations: [],
  vertical: null,
  verticals: [
    { text: 'Select Option', value: null },
    'Multi Family',
    'Self Storage',
    'Senior Living'
  ],
  user: null,
  users: [],
  team: 'da',
  teams: [
    { text: 'Digital Advertising', value: 'da' },
    { text: 'SEO', value: 'seo' },
    { text: 'Customer Care', value: 'cc', disabled: true }
  ],
  category: 'None',
  categories: {
    null: [
      { text: 'Select a Team First', value: 'None' }
    ],
    da: [
      { text: 'Select Option', value: 'None' },
      { text: 'Account Changes', value: 'Account Changes' },
      { text: 'Content Pilot', value: 'Content Pilot' },
      { text: 'Customer Contact', value: 'Customer Contact' },
      { text: 'General Note', value: 'General Note' },
      { text: 'Optimizations', value: 'Optimizations' },
      { text: 'Other', value: 'Other' },
      { text: 'Technical Issue', value: 'Technical Issue' }
    ],
    seo: [
      { text: 'Select Option', value: 'None' },
      { text: 'Account Changes', value: 'Account Changes' },
      { text: 'Account Audit', value: 'Account Audit' },
      { text: 'Customer Contact', value: 'Customer Contact' },
      { text: 'Content Pilot', value: 'Content Pilot' },
      { text: 'General Note', value: 'General Note' },
      { text: 'Optimizations', value: 'Optimizations' },
      { text: 'Other', value: 'Other' },
      { text: 'Technical Issue', value: 'Technical Issue' }
    ],
    cc: []
  },
  actionType: 'None',
  actionTypes: {
    null: {
      da: [
        { text: 'Select a Category First', value: 'None' }
      ],
      seo: [
        { text: 'Select a Category First', value: 'None' }
      ],
      cc: [
        { text: 'Select a Category First', value: 'None' }
      ]
    },
    None: {
      da: [
        { text: 'Select a Category First', value: 'None' }
      ],
      seo: [
        { text: 'Select a Category First', value: 'None' }
      ],
      cc: [
        { text: 'Select a Category First', value: 'None' }
      ]
    },
    'Account Audit': {
      da: [],
      seo: [
        { text: 'Select Option', value: 'None' },
        'Site Health Check',
        'SEO Audit',
        'Performance Analysis',
        'Client Recommendation'
      ],
      cc: []
    },
    'Account Changes': {
      da: [
        { text: 'Select Option', value: 'None' },
        'Smart Bidding Strategy Change',
        'Specials/Promotions',
        'Spend Optimizer Version Change',
        'URL Change',
        'Whitelisting Events Change'
      ],
      seo: [
        { text: 'Select Option', value: 'None' },
        'Service Upgrade',
        'Service Downgrade',
        'Business Information'
      ],
      cc: [
        { text: 'Select Option', value: 'None' }
      ]
    },
    'General Note': {
      da: [{ text: 'None', value: 'None' }],
      seo: [{ text: 'None', value: 'None' }],
      cc: [{ text: 'None', value: 'None' }]
    },
    'Content Pilot': {
      da: [
        { text: 'Select Option', value: 'None' },
        'Ad Copy',
        'Descriptions',
        'H1',
        'Onpage Content',
        'Title Tags'
      ],
      seo: [
        { text: 'Select Option', value: 'None' },
        'Ad Copy',
        'Descriptions',
        'H1',
        'Onpage Content',
        'Title Tags'
      ],
      cc: [
        { text: 'Select Option', value: 'None' }
      ]
    },
    'Customer Contact': {
      da: [
        { text: 'Select Option', value: 'None' },
        'Action Items',
        'Analysis/Notes'
      ],
      seo: [
        { text: 'Select Option', value: 'None' },
        'Action Items',
        'Analysis/Notes',
        'User Access'
      ],
      cc: [
        { text: 'Select Option', value: 'None' }
      ]
    },
    Optimizations: {
      da: [
        { text: 'Select Option', value: 'None' },
        'Added Negative Keywords',
        'Added Keywords',
        'Changed Location Strategy',
        'Updated Geographic Targeting',
        'Updated Audiences',
        'Paused Campaign',
        'Enabled Campaign',
        'Refreshed Ad Copy',
        'Testing',
        'T&O Added',
        'Manual Spend Adjustments',
        'Manual Bid Adjustments'
      ],
      seo: [
        { text: 'Select Option', value: 'None' },
        'Keyword Strategy Update',
        'Website - Content',
        'Website - Technical',
        'GMB'
      ],
      cc: [{ text: 'Select Option', value: 'None' }]
    },
    Other: {
      da: [
        { text: 'Select Option', value: 'None' },
        'Uncontrollable Circumstances'
      ],
      seo: [{ text: '-', value: 'None' }],
      cc: [{ text: '-', value: 'None' }]
    },
    'Technical Issue': {
      da: [
        { text: 'Select Option', value: 'None' },
        'DA WoW',
        'Dynamic Pricing',
        'Dynamic Availability',
        'Reporting Issue',
        'DAM - Account Selection',
        'DAM - Sitelink Selection',
        'DAM - Campaign/Ad Group Selection'
      ],
      seo: [
        { text: 'Select Option', value: 'None' },
        'Website',
        'GMB',
        'Business Listings',
        'Reporting Issue'
      ],
      cc: [{ text: 'Select Option', value: 'None' }]
    }
  },
  isInternal: null,
  isInternals: [
    { text: 'Both', value: null },
    { text: 'Internal Only', value: true },
    { text: 'Customer-Facing', value: false }
  ],
  startDate: null,
  endDate: null,
  isCreatedAt: true,
  fromDate: null,
  toDate: null,
  salesforceSync: {}
})

export const actions = {
  async onUpdate({ commit }, payload) {
    await commit('ON_UPDATE', payload)
  },
  async onRemove({ commit }, payload) {
    await commit('ON_REMOVE', payload)
  },
  async onReset({ commit }) {
    await commit('ON_RESET')
  },
  async fillClients({ commit }) {
    const clients = await this.$axios
      .$get('api/hub/clients?activeDa=false&internal=false')
    commit('FILL_CLIENTS', clients)
    return clients
  },
  async fillUsers({ commit }) {
    await this.$axios
      .$get('api/v1/strategists')
      .then(user => [...user.map(u => ({
        text: `${u.first_name} ${u.last_name}`,
        value: u.email,
        id: u.id
      })), { text: 'Select a User', value: null }])
      .then(users => commit('FILL_USERS', users))
  }
}

export const getters = {
  showDates(state) {
    const matches = [
      'Specials/Promotions',
      'Testing',
      'Uncontrollable Circumstance',
      'DA WoW',
      'Other',
      'Dynamic Pricing',
      'Dynamic Availability'
    ]
    return matches.includes(state.actionType)
  }
}

export const mutations = {
  ON_UPDATE(state, payload) {
    const keys = Object.keys(payload)
    keys.forEach((key) => {
      state[key] = payload[key]
    })
  },
  ON_REMOVE(state, payload) {
    const newState = state[payload.key].filter(k => k.urn !== payload.value.urn)
    state[payload.key] = newState
  },
  ON_RESET(state) {
    state.client = null
    state.location = []
    state.locations = []
    state.category = 'None'
    state.actionType = 'None'
    state.team = 'da'
    state.user = null
    state.isInternal = null
    state.startDate = null
    state.endDate = null
    state.isCreatedAt = true
    state.fromDate = null
    state.toDate = ''
  },
  FILL_CLIENTS(state, payload) {
    state.clients = payload
  },
  FILL_USERS(state, payload) {
    state.users = payload
  }
}
