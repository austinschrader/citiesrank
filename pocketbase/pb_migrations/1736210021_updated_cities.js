/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_cost_number",
    "name": "cost",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 100,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "city_cost_number",
    "name": "cost",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 100,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
})
