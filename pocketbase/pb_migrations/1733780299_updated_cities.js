/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "chmttjwc",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "country",
        "region",
        "city",
        "neighborhood",
        "sight"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "chmttjwc",
    "name": "type",
    "type": "select",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 5,
      "values": [
        "country",
        "region",
        "city",
        "neighborhood",
        "sight"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
