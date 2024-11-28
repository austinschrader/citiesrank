/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "jjkgapsh",
    "name": "costIndex",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 10,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "zjpxayfa",
    "name": "safetyScore",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 10,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kadsyvhi",
    "name": "walkScore",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 10,
      "noDecimal": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "vyonydag",
    "name": "transitScore",
    "type": "number",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": 0,
      "max": 10,
      "noDecimal": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("cities_list")

  // remove
  collection.schema.removeField("jjkgapsh")

  // remove
  collection.schema.removeField("zjpxayfa")

  // remove
  collection.schema.removeField("kadsyvhi")

  // remove
  collection.schema.removeField("vyonydag")

  return dao.saveCollection(collection)
})
