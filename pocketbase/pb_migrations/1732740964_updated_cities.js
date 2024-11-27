/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_normalized_name",
    "name": "normalizedName",
    "type": "text",
    "required": true,
    "presentable": true,
    "unique": false,
    "options": {
      "min": 1,
      "max": 100,
      "pattern": "^[a-z0-9 ]+$"
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_normalized_name",
    "name": "normalizedName",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 100,
      "pattern": "^[a-z0-9 ]+$"
    }
  }))

  return dao.saveCollection(collection)
})
