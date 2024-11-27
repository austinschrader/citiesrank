/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_name_field",
    "name": "name",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": true,
    "options": {
      "min": 1,
      "max": 100,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_name_field",
    "name": "name",
    "type": "text",
    "required": true,
    "presentable": true,
    "unique": true,
    "options": {
      "min": 1,
      "max": 100,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
