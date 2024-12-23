/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // remove
  collection.schema.removeField("city_population_value")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_population_value",
    "name": "population",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 1,
      "max": 50,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
