/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ciwyiran",
    "name": "visibility",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "public",
        "private"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  // remove
  collection.schema.removeField("ciwyiran")

  return dao.saveCollection(collection)
})
