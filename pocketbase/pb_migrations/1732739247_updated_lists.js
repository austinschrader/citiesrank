/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lists_table")

  // remove
  collection.schema.removeField("list_places")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "etea7phh",
    "name": "list_places",
    "type": "relation",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "list_places_table",
      "cascadeDelete": true,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lists_table")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "list_places",
    "name": "places",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("etea7phh")

  return dao.saveCollection(collection)
})
