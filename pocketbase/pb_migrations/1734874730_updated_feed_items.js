/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c")

  // remove
  collection.schema.removeField("mpdhrawt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9yszxajo",
    "name": "curator",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "mpdhrawt",
    "name": "curator",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "cities_list",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("9yszxajo")

  return dao.saveCollection(collection)
})
