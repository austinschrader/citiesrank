/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "x16smsxafwg9b0c",
    "created": "2024-12-22 12:42:04.945Z",
    "updated": "2024-12-22 12:42:04.945Z",
    "name": "feed_items",
    "type": "base",
    "system": false,
    "schema": [
      {
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
      },
      {
        "system": false,
        "id": "mliihmf7",
        "name": "source_type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "tag",
            "place",
            "system"
          ]
        }
      },
      {
        "system": false,
        "id": "aezyj8oa",
        "name": "source_name",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "018l1xhf",
        "name": "place",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "cities_list",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "qjharmlm",
        "name": "places",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "cities_list",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "uqoacwhz",
        "name": "stats",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "f3ejub6n",
        "name": "content",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "mpdhrawt",
        "name": "curator",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "cities_list",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "3owldlaa",
        "name": "timestamp",
        "type": "date",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "@request.auth.id != \"\"",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\" && @request.auth.id = @request.data.curator",
    "updateRule": "@request.auth.id != \"\" && @request.auth.id = @request.data.curator",
    "deleteRule": "@request.auth.id != \"\" && @request.auth.id = curator",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("x16smsxafwg9b0c");

  return dao.deleteCollection(collection);
})
