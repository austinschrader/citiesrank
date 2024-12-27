/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lhc294yr",
    "name": "place_count",
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
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  // remove
  collection.schema.removeField("lhc294yr")

  return dao.saveCollection(collection)
})
