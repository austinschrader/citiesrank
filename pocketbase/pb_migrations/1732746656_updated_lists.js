/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lists_table")

  // remove
  collection.schema.removeField("list_related_lists")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "u5fqv39e",
    "name": "relatedLists",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "lists_table",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("lists_table")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "list_related_lists",
    "name": "relatedLists",
    "type": "json",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSize": 2000000
    }
  }))

  // remove
  collection.schema.removeField("u5fqv39e")

  return dao.saveCollection(collection)
})
