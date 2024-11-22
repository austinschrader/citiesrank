/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wmmnhjc7jej7ohx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rdwarkug",
    "name": "isoCode",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wmmnhjc7jej7ohx")

  // remove
  collection.schema.removeField("rdwarkug")

  return dao.saveCollection(collection)
})
