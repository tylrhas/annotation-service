const moment = require('moment')
const models = require('../../models/primary')
module.exports = async function (job, sfApi) {
  const { data } = job
  if (!sfApi.isLoggedIn) {
    console.log('Signing In')
    await sfApi.signIn()
  }
  const dbAnnotation = await models.annotation.findOne({
    where: {
      id: data.id
    },
    include: [
      { model: models.g5_updatable_client },
      { model: models.annotationCategory },
      { model: models.annotationType },
      { model: models.annotationUser },
      { model: models.g5_updatable_location }
    ]
  })
  const { Id: OwnerId } = await sfApi.getUserId({ email: dbAnnotation.dataValues.annotationUser.email }, ['Id'])
  if (dbAnnotation.dataValues.g5_updatable_locations.length > 0) {
    for (let i = 0; i < dbAnnotation.dataValues.g5_updatable_locations.length; i++) {
      const location = dbAnnotation.g5_updatable_locations[i]
      const dbAnnotationLocation = location.annotationLocation
      const { salesforce_id: noteId } = dbAnnotationLocation.dataValues
      const { Id: WhatId } = await sfApi.findLocation({ Location_URN__c: location.urn }, ['Id'])
      if (noteId) {
        const update = {
          WhatId,
          OwnerId,
          Task_Category__c: dbAnnotation.annotationCategory.dataValues.name,
          Task_Action_Type__c: dbAnnotation.annotationType ? dbAnnotation.annotationType.dataValues.name : null,
          Internal_Only__c: dbAnnotation.dataValues.internal,
          Description: dbAnnotation.dataValues.html,
          ActivityDate: moment().format('YYYY-MM-DD'),
          Subject: dbAnnotation.annotationCategory.dataValues.name
        }
        await sfApi.updateNote(noteId, update)
      } else {
        const {
          html,
          internal,
          annotationCategory,
          annotationType,
          createdAt
        } = dbAnnotation
        const { id: noteId } = await sfApi.createNote(WhatId, OwnerId, annotationCategory.dataValues.name, annotationType ? annotationType.dataValues.name : null, internal, html, moment(createdAt).format('YYYY-MM-DD'), 'Completed', annotationCategory.dataValues.name, 'DA Task')
        await dbAnnotationLocation.update({ salesforce_id: noteId })
      }
    }
  } else {
    const { Id: WhatId } = await sfApi.findAccount({ Client_URN__c: dbAnnotation.g5_updatable_client.dataValues.urn }, ['Id'])
    const update = {
      WhatId,
      OwnerId,
      Task_Category__c: dbAnnotation.annotationCategory.dataValues.name,
      Task_Action_Type__c: dbAnnotation.annotationType ? dbAnnotation.annotationType.dataValues.name : null,
      Internal_Only__c: dbAnnotation.dataValues.internal,
      Description: dbAnnotation.dataValues.html,
      ActivityDate: moment().format('YYYY-MM-DD'),
      Subject: dbAnnotation.annotationCategory.dataValues.name
    }
    await sfApi.updateNote(dbAnnotation.dataValues.salesforce_id, update)
  }
}
