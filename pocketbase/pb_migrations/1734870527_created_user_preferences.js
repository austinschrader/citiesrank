/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ew6ettfw1hsiaf0",
    "created": "2024-12-22 12:28:47.213Z",
    "updated": "2024-12-22 12:28:47.213Z",
    "name": "user_preferences",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "4fdekww5",
        "name": "followed_tags",
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
        "id": "ujmjkngy",
        "name": "followed_places",
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
        "id": "xgvrhjdk",
        "name": "user",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": null
        }
      }
    ],
    "indexes": [
      "CREATE UNIQUE INDEX `idx_WcYHMD0` ON `user_preferences` (`user`)"
    ],
    "listRule": "@request.auth.id = user",
    "viewRule": "@request.auth.id = user",
    "createRule": "@request.auth.id = user",
    "updateRule": "@request.auth.id = user",
    "deleteRule": "@request.auth.id = user",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ew6ettfw1hsiaf0");

  return dao.deleteCollection(collection);
})
