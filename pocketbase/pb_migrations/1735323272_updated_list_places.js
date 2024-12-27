/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lwmm8sntjq5frg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rbdga0xy",
    "name": "list",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "5iaqdk8ccqd45xr",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("9lwmm8sntjq5frg")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rbdga0xy",
    "name": "list",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "5iaqdk8ccqd45xr",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
})
