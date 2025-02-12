/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6jxfd2bq",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "trending_place",
        "place_collection",
        "similar_places",
        "place_update",
        "tag_spotlight",
        "friend_activity",
        "photo_challenge"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "6jxfd2bq",
    "name": "type",
    "type": "select",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "trending_place",
        "place_collection",
        "similar_places",
        "place_update",
        "tag_spotlight"
      ]
    }
  }))

  return dao.saveCollection(collection)
})
