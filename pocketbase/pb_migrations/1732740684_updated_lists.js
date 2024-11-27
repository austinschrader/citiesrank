/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lists_table")

  // remove
  collection.schema.removeField("etea7phh")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "bpjfg23d",
    "name": "list_places",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "cities_list",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
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
      "maxSelect": null,
      "displayFields": null
    }
  }))

  // remove
  collection.schema.removeField("bpjfg23d")

  return dao.saveCollection(collection)
})
