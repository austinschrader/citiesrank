/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lssapqyk",
    "name": "latitude",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "wuk8crvv",
    "name": "longitude",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // remove
  collection.schema.removeField("lssapqyk")

  // remove
  collection.schema.removeField("wuk8crvv")

  return dao.saveCollection(collection)
})
