/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4p9o81cfqrmoah0")

  // remove
  collection.schema.removeField("beuahm2u")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0nk9uaas",
    "name": "country",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "wmmnhjc7jej7ohx",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("4p9o81cfqrmoah0")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "beuahm2u",
    "name": "country",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("0nk9uaas")

  return dao.saveCollection(collection)
})
