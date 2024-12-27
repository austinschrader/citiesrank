/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("lists_table");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "lists_table",
    "created": "2024-11-21 03:43:25.694Z",
    "updated": "2024-12-23 05:34:03.450Z",
    "name": "lists",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "list_title_field",
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": true,
        "unique": true,
        "options": {
          "min": 1,
          "max": 200,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "list_description_text",
        "name": "description",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": 500,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "list_status",
        "name": "status",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "published",
            "draft"
          ]
        }
      },
      {
        "system": false,
        "id": "list_collection",
        "name": "collection",
        "type": "select",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "want-to-visit",
            "visited",
            "planning",
            "favorites"
          ]
        }
      },
      {
        "system": false,
        "id": "list_privacy",
        "name": "privacy",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "public",
            "private",
            "followers"
          ]
        }
      },
      {
        "system": false,
        "id": "list_total_places",
        "name": "totalPlaces",
        "type": "number",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": null,
          "noDecimal": true
        }
      },
      {
        "system": false,
        "id": "list_author_id",
        "name": "author",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": [
            "name"
          ]
        }
      },
      {
        "system": false,
        "id": "list_category",
        "name": "category",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 1,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "list_is_verified",
        "name": "isVerified",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "list_tags",
        "name": "tags",
        "type": "json",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 2000000
        }
      },
      {
        "system": false,
        "id": "bpjfg23d",
        "name": "places",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "cities_list",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": null,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "vpsu43e8",
        "name": "likes",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 1000000,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "agqrjnsm",
        "name": "shares",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 1000000,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "kjgtvdvx",
        "name": "saves",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 1000000,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "ugkswmpt",
        "name": "views",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": 0,
          "max": 1000000,
          "noDecimal": false
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
