/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "salr6dge",
    "name": "averageRating",
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
    "id": "exmy2poy",
    "name": "totalReviews",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("5iaqdk8ccqd45xr")

  // remove
  collection.schema.removeField("salr6dge")

  // remove
  collection.schema.removeField("exmy2poy")

  return dao.saveCollection(collection)
})
