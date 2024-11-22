/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wmmnhjc7jej7ohx")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "rfek159o",
    "name": "population",
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
    "id": "giewgak0",
    "name": "description",
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
  collection.schema.removeField("rfek159o")

  // remove
  collection.schema.removeField("giewgak0")

  return dao.saveCollection(collection)
})
