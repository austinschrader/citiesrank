/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("esm26wbvcx1n10c")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a5uvuj2v",
    "name": "list",
    "type": "relation",
    "required": false,
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
  const collection = dao.findCollectionByNameOrId("esm26wbvcx1n10c")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "a5uvuj2v",
    "name": "list",
    "type": "relation",
    "required": false,
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
